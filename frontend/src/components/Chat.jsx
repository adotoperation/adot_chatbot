import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, LogOut, Bot, User, Loader2 } from 'lucide-react';

const Chat = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: `안녕하세요, 원장님! '디쉐어 에이닷 영어학원' 본사 행정/인사팀 동료입니다.\n전국 지점의 원장님과 직원분들을 위해 무엇을 도와드릴까요?\n\n궁금하신 행정 또는 인사 업무에 대해 질문해 주세요!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // In production, the backend is prefixed with /_/backend as per the service config.
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const response = await axios.post(`${apiBase}/chat`, { message: userMsg });
      setMessages(prev => [...prev, { role: 'bot', content: response.data.reply }]);
    } catch (err) {
      const errorMsg = err.response?.data?.reply || '죄송합니다. 서버와 연결할 수 없거나 오류가 발생했습니다.';
      setMessages(prev => [...prev, { role: 'bot', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card fade-in" style={{ width: '900px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Bot color="white" size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>본사 행정·인사 전문가</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '600' }}>● 전국 88개 지점 실시간 지원 중</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={async () => {
              try {
                const apiBase = import.meta.env.VITE_API_URL || '/api';
                const res = await axios.post(`${apiBase}/reload_docs`);
                alert(res.data.message);
              } catch (e) {
                alert('문서 로드 실패: ' + (e.response?.data?.message || '서버 오류'));
              }
            }} 
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            문서 새로고침
          </button>
          <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={18} /> 로그아웃
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {msg.role === 'bot' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <Bot size={18} />
              </div>
            )}
            <div style={{
              padding: '1rem', borderRadius: '18px', background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)',
              color: 'white', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', textAlign: 'left'
            }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <User size={18} color="black" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Bot size={18} />
            </div>
            <div style={{ padding: '1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
              <Loader2 className="animate-spin" size={18} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력하세요..."
          style={{
            flex: 1, padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)',
            background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{ width: '56px', height: '56px', borderRadius: '16px', border: 'none', background: 'var(--primary-gradient)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
