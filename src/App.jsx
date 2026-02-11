import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, BookOpen, MessageSquare, Cpu } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// PDF.js CDN 설정 (안정적인 버전 사용)
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

async function loadPdfJS() {
  if (window.pdfjsLib) return window.pdfjsLib;

  return new Promise((resolve, reject) => {
    if (document.getElementById('pdfjs-script')) return;
    const script = document.createElement('script');
    script.id = 'pdfjs-script';
    script.src = PDFJS_CDN;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
      resolve(window.pdfjsLib);
    };
    script.onerror = (e) => reject(new Error("PDF.js 라이브러리를 로드할 수 없습니다."));
    document.head.appendChild(script);
  });
}

// --- RAG Logic Integrated ---
class RAGEngine {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.apiKey = apiKey;
    this.documents = [];
    this.embeddings = [];
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // 사용자의 요청에 따라 2.5 버전으로 복구
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        topK: 40,
      }
    });
    this.embeddingModel = this.genAI.getGenerativeModel({
      model: "gemini-embedding-001"
    });
  }

  // 코사인 유사도 계산
  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // 텍스트를 임베딩으로 변환 (단일)
  async getEmbedding(text) {
    try {
      const result = await this.embeddingModel.embedContent({
        content: { parts: [{ text }] },
        taskType: 'RETRIEVAL_QUERY'
      });
      return result.embedding.values;
    } catch (error) {
      console.error('Embedding error:', error);
      throw error;
    }
  }

  // 여러 텍스트를 한 번에 임베딩으로 변환 (배치 처리)
  async getEmbeddings(texts) {
    try {
      const result = await this.embeddingModel.batchEmbedContents({
        requests: texts.map(text => ({
          content: { parts: [{ text }] },
          taskType: 'RETRIEVAL_DOCUMENT'
        }))
      });
      return result.embeddings.map(e => e.values);
    } catch (error) {
      console.error('Batch embedding error:', error);
      throw error;
    }
  }

  async processPDF(source) {
    const pdfjsLib = await loadPdfJS();
    let arrayBuffer;

    if (source instanceof File) {
      arrayBuffer = await source.arrayBuffer();
    } else if (typeof source === 'string') {
      const response = await fetch(source);
      if (!response.ok) throw new Error("파일을 찾을 수 없습니다.");
      arrayBuffer = await response.arrayBuffer();
    } else {
      arrayBuffer = source;
    }

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      fullText += strings.join(" ") + "\n";
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([fullText]);
    const texts = docs.map(doc => doc.pageContent);

    // 각 문서 청크에 대한 임베딩 생성 (배치 처리)
    // 한 번에 너무 많은 요청을 보내지 않도록 최대 100개씩 나눠서 처리
    const batchSize = 100;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batchTexts = texts.slice(i, i + batchSize);
      const batchEmbeddings = await this.getEmbeddings(batchTexts);

      this.documents.push(...batchTexts);
      this.embeddings.push(...batchEmbeddings);
    }
  }

  async chat(query) {
    if (this.documents.length === 0) {
      return "먼저 PDF 파일을 업로드해 주세요.";
    }

    try {
      // 쿼리를 임베딩으로 변환
      const queryEmbedding = await this.getEmbedding(query);

      // 각 문서와의 유사도 계산
      const similarities = this.embeddings.map((docEmbedding, idx) => ({
        index: idx,
        similarity: this.cosineSimilarity(queryEmbedding, docEmbedding)
      }));

      // 유사도 순으로 정렬하고 상위 5개 선택
      const topDocs = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5)
        .map(item => this.documents[item.index]);

      const context = topDocs.join("\n\n---\n\n");

      if (!context.trim()) {
        return "문서에서 관련 내용을 찾을 수 없습니다.";
      }

      const prompt = `
당신은 제공된 PDF 문서의 내용에만 근거하여 답변하는 전문 비서입니다.
오직 아래 [Context] 정보만을 사용하여 질문에 답변하세요.

[규칙]
1. 한국어로 답변하세요.
2. 정보가 부족하면 "문서에서 해당 내용을 찾을 수 없습니다."라고 답변하세요.
3. 절대 지어내지 마세요.

[Context]
${context}

[Question]
${query}

[Answer]
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('RAGEngine Error:', error);
      throw new Error(`답변 생성 중 오류: ${error.message}`);
    }
  }
}

// --- Main App Component ---
// 주의: 보안을 위해 실제 서비스 시에는 API 키를 .env 파일 등으로 관리하세요.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '에이닷 운영 챗봇입니다. 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(0); // 쿨다운 시간(초)
  const chatEndRef = useRef(null);
  const ragRef = useRef(null);

  useEffect(() => {
    ragRef.current = new RAGEngine(GEMINI_API_KEY);

    const autoLoad = async () => {
      try {
        const response = await fetch('/files/manifest.json');
        if (!response.ok) return;
        const files = await response.json();

        setIsProcessing(true);
        for (const fileName of files) {
          try {
            await ragRef.current.processPDF(`/files/${fileName}`);
            setPdfs(prev => {
              const displayName = `${fileName} (자동 학습됨)`;
              return prev.includes(displayName) ? prev : [...prev, displayName];
            });
          } catch (err) {
            console.error(`로딩 실패: ${fileName}`, err);
          }
        }
      } catch (e) {
        console.log("자동 로드할 파일이 없습니다.");
      } finally {
        setIsProcessing(false);
      }
    };
    autoLoad();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 쿨다운 타이머 기능
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);


  const handleSend = async () => {
    if (!input.trim() || isTyping || cooldown > 0) return;
    const userQuery = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsTyping(true);
    setCooldown(5); // 전송 후 5초 쿨다운 설정
    try {
      const response = await ragRef.current.chat(userQuery);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      let errorMsg = error.message;
      if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        errorMsg = "현재 요청량이 많아 잠시 제한되었습니다. 약 1분 후 다시 시도해 주세요.";
        setCooldown(60); // 429 에러 발생 시 60초 쿨다운
      }
      setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      {/* 사이드바 */}
      <aside className="sidebar">
        <div className="logo-section">
          <BookOpen size={28} color="#3b82f6" />
          <h2 className="logo-text">에이닷 운영 챗봇</h2>
        </div>

        <div className="doc-list-section">
          <h4>학습된 문서</h4>
          <div className="doc-list">
            {pdfs.map((name, i) => (
              <div key={i} className="doc-item">
                <BookOpen size={16} color="#3b82f6" />
                <span className="truncate" title={name}>{name}</span>
              </div>
            ))}
            {pdfs.length === 0 && !isProcessing && <p className="empty-msg">업로드된 문서가 없습니다.</p>}
            {isProcessing && (
              <div className="doc-item processing">
                <Loader2 className="animate-spin" color="#3b82f6" size={16} />
                <span>문서 분석 중...</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 메인 채팅창 */}
      <main className="chat-main">
        <header className="chat-header">
          <div className="header-title">
            <MessageSquare size={20} color="#3b82f6" />
            <span>상담 채팅</span>
          </div>
          {isTyping && <div className="typing-indicator">에이닷이 답변을 생성하고 있습니다...</div>}
        </header>

        <div className="messages-container">
          {messages.map((msg, i) => (
            <div key={i} className={`message-item ${msg.role}`}>
              <div className="message-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="input-section">
          <div className="input-container">
            <input
              className="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={cooldown > 0 ? `잠시 기다려 주세요 (${cooldown}s)...` : "궁금한 내용을 질문하세요..."}
              disabled={isProcessing || isTyping || cooldown > 0}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isProcessing || isTyping || cooldown > 0}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
