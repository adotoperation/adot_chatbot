import os
import requests
import io
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Robust imports for LangChain (handles different versions)
try:
    from langchain.chains import RetrievalQA
except Exception as e:
    print(f"[FATAL] Failed to import RetrievalQA: {e}")
    RetrievalQA = None

try:
    from langchain_community.document_loaders import PyPDFLoader, TextLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_community.vectorstores import FAISS
    from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
    from langchain.prompts import PromptTemplate
except Exception as e:
    print(f"[FATAL] Failed to import core RAG components: {e}")
    print("Please run: pip install -U langchain-community langchain-text-splitters faiss-cpu pypdf langchain-google-genai")

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# Global Vector Store
vector_store = None

def initialize_rag():
    global vector_store
    print("\n" + "="*40)
    print("[RAG] Initializing Knowledge Base...")
    try:
        documents = []
        doc_path = os.path.join(os.path.dirname(__file__), 'docs')
        if not os.path.exists(doc_path):
            os.makedirs(doc_path)
            print(f"[RAG] Created directory: {doc_path}")
        
        pdf_files = [f for f in os.listdir(doc_path) if f.endswith('.pdf')]
        txt_files = [f for f in os.listdir(doc_path) if f.endswith('.txt')]
        print(f"[RAG] Found PDF files: {pdf_files}")
        print(f"[RAG] Found Text files: {txt_files}")
        
        for file in pdf_files:
            try:
                loader = PyPDFLoader(os.path.join(doc_path, file))
                documents.extend(loader.load())
                print(f"[RAG] Loaded PDF document: {file}")
            except Exception as e:
                print(f"[RAG] Failed to load PDF {file}: {e}")

        for file in txt_files:
            try:
                loader = TextLoader(os.path.join(doc_path, file), encoding='utf-8')
                documents.extend(loader.load())
                print(f"[RAG] Loaded Text document: {file}")
            except Exception as e:
                # Retry with cp949 for Windows text files if utf-8 fails
                try:
                    loader = TextLoader(os.path.join(doc_path, file), encoding='cp949')
                    documents.extend(loader.load())
                    print(f"[RAG] Loaded Text document (cp949): {file}")
                except:
                    print(f"[RAG] Failed to load Text {file}: {e}")
        
        if documents:
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            splits = text_splitter.split_documents(documents)
            embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
            vector_store = FAISS.from_documents(splits, embeddings)
            print(f"[RAG] SUCCESS: {len(pdf_files) + len(txt_files)} files indexed.")
            return True
        else:
            print("[RAG] CRITICAL: No files found in 'backend/docs/'.")
            print("[RAG] Please place PDF or TXT manuals in 'backend/docs/' and restart.")
            return False
    except Exception as e:
        print(f"[RAG] ERROR during initialization: {e}")
        return False
    finally:
        print("="*40 + "\n")

@app.route('/reload_docs', methods=['POST'])
def reload_docs():
    success = initialize_rag()
    if success:
        return jsonify({"success": True, "message": "문서가 성공적으로 로드되었습니다."})
    else:
        return jsonify({"success": False, "message": "문서를 찾을 수 없습니다. api/docs 폴더를 확인하세요."}), 404

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        input_user = str(data.get('username', '')).strip().lower()
        input_pass = str(data.get('password', '')).strip()
        
        print(f"[Login] Bypass login attempt for user: '{input_user}'")
        
        # Simplified: Allow any login while Google Sheets is disabled
        return jsonify({"success": True})
        
    except Exception as e:
        print(f"[Login] System Error: {e}")
        return jsonify({"success": False, "message": f"로그인 처리 중 오류: {str(e)}"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    if not GOOGLE_API_KEY:
        return jsonify({"reply": "API Key가 구성되지 않았습니다. .env 파일을 확인해주세요."}), 500
        
    data = request.json
    message = data.get('message')
    if not message:
        return jsonify({"reply": "질문을 입력해주세요."}), 400
    
    try:
        # 1. First choice: Use RAG (RetrievalQA)
        if vector_store and RetrievalQA:
            print(f"[Chat] Using RAG for query: {message[:30]}...")
            prompt_template = """
            [System Instruction]
            1. 페르소나 (Persona):
            - 당신은 '디쉐어(D-Share) 에이닷 영어학원' 본사의 행정 및 인사 업무 지원 전문가입니다.
            - 주요 답변 대상은 전국 88개 지점의 원장님과 지점 직원들입니다. 초보자의 눈높이에서 아주 친절하고 명확하게 설명하세요.
            - 톤앤매너: 정중하면서도 따뜻한 본사 동료의 말투 (~하시면 됩니다!, ~가 필요해요.)

            2. 지식 범위 및 제약 사항 (Constraints):
            - 반드시 제공된 [Context] 내용만을 근거로 답변하세요.
            - 매뉴얼에 없는 내용이나 판단이 필요한 질문에는 반드시 다음 문구만 출력하세요: "해당 내용은 매뉴얼에 명시되어 있지 않아 확인이 필요합니다. 본사 영업지원팀 또는 인사팀 담당자에게 문의해 주세요."
            - 매뉴얼 텍스트를 그대로 노출하지 말고, 질문에 필요한 부분만 요약/재구성하여 답변하세요.

            3. 답변 구조 (Response Structure) (순서 절대 엄수):
            - 공감 및 도입: 지점 상황에 공감하는 짧은 한 마디.
            - 지점 가이드 (핵심): 단계별(Step-by-step) 행동 지침 (번호 매기기나 불렛 포인트 사용).
            - 마무리 질문 (필수): "추가로 학생 또는 학부모님들이 해야 할 일을 알려드릴까요?" 라는 문구로 끝맺음.

            [Context]
            {context}

            질문: {question}
            행정·인사 전문가 답변:"""
            
            PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
            # Upgraded to Gemini 2.0 Flash - 8a8d29 (Enhanced for Vercel deployment)
            llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=GOOGLE_API_KEY, temperature=0)
            
            chain = RetrievalQA.from_chain_type(
                llm=llm, 
                chain_type="stuff", 
                retriever=vector_store.as_retriever(search_kwargs={"k": 5}),
                chain_type_kwargs={"prompt": PROMPT},
                return_source_documents=True
            )
            
            response = chain.invoke({"query": message})
            answer = response.get('result', "해당 내용은 매뉴얼에 명시되어 있지 않아 확인이 필요합니다. 본사 영업지원팀 또는 인사팀 담당자에게 문의해 주세요.")
            
            # Post-check to ensure the closing question is always present
            closing_phrase = "추가로 학생 또는 학부모님들이 해야 할 일을 알려드릴까요?"
            if closing_phrase not in answer:
                answer = answer.strip() + f"\n\n{closing_phrase}"

            return jsonify({"reply": answer})
            
        # 2. Second choice: Fallback to pure Gemini
        else:
            print(f"[Chat] RAG unavailable. Falling back to Gemini 2.0 Flash: {message[:30]}...")
            model = genai.GenerativeModel('gemini-2.0-flash')
            fallback_prompt = f"""
            당신은 '디쉐어(D-Share) 에이닷 영어학원' 본사의 행정 및 인사 업무 지원 전문가입니다.
            현재 등록된 매뉴얼 파일이 없습니다. 일반적인 지식으로 답변하되, 
            반드시 마지막에는 "해당 내용은 매뉴얼에 명시되어 있지 않아 확인이 필요합니다. 본사 영업지원팀 또는 인사팀 담당자에게 문의해 주세요."라고 덧붙이고,
            "추가로 학생 또는 학부모님들이 해야 할 일을 알려드릴까요?" 라는 질문으로 끝내주세요.
            
            질문: {message}"""
            
            response = model.generate_content(fallback_prompt)
            # (Rest of safety check logic remains same)
            
            try:
                if response.text:
                    return jsonify({"reply": response.text})
                else:
                    return jsonify({"reply": "죄송합니다. 적절한 답변을 생성할 수 없습니다 (안전 필터)."}), 200
            except (ValueError, AttributeError):
                # This happens if the response was blocked
                print(f"[Chat] Error: LLM response blocked or empty.")
                return jsonify({"reply": "죄송합니다. 관련 규정에 대한 답변이 차단되었습니다. 인사팀으로 직접 문의 부탁드립니다."}), 200

    except Exception as e:
        print(f"[Chat] System Error: {e}")
        return jsonify({"reply": f"죄송합니다. 시스템 오류가 발생했습니다: {str(e)}"}), 500

if __name__ == '__main__':
    initialize_rag()
    app.run(debug=True, port=5000)
