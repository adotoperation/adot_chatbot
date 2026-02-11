# 🤖 에이닷 운영 챗봇 (A-Dot Operations Chatbot)

이 프로젝트는 Google Gemini API와 RAG(Retrieval-Augmented Generation) 기술을 활용한 지능형 상담 챗봇입니다. PDF 문서를 학습하여 문서의 내용에 기반한 정확한 답변을 제공합니다.

## ✨ 주요 기능

- **PDF 문서 학습**: `/files` 폴더의 문서를 자동으로 읽어와 학습합니다.
- **RAG 기반 답변**: 학습된 문서 내에서 가장 관련성 높은 정보를 찾아 답변을 생성합니다.
- **실시간 대화**: 현대적이고 깔끔한 UI를 통해 실시간으로 상담이 가능합니다.
- **보안 관리**: API 키를 환경 변수로 관리하여 안전하게 처리합니다.

## 🚀 빠른 시작

### 1. 환경 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 API 키를 설정하세요:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 로컬 실행
```bash
npm run dev
```

## 🌐 배포 가이드 (Vercel)

1. 이 저장소를 GitHub에 업로드합니다.
2. Vercel에서 새로운 프로젝트를 생성하고 GitHub 저장소를 연결합니다.
3. **Environment Variables** 설정에서 `VITE_GEMINI_API_KEY` 항목을 추가하고 실제 API 키를 입력합니다.
4. 배포를 진행합니다.

## 🛠 기술 스택

- **Frontend**: React, Vite, Lucide-React
- **AI/LLM**: Google Gemini (gemini-2.5-flash), LangChain
- **STYLING**: Vanilla CSS
