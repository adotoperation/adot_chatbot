import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, User, Lock, Loader2 } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiBase}/api/login`, { username, password });
      if (response.data.success) {
        onLogin({ username, remember });
      }
    } catch (err) {
      // Show explicit server error message
      const serverMsg = err.response?.data?.message;
      setError(serverMsg || '로그인에 실패했습니다. 서버 연결을 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card fade-in" style={{ padding: '3rem', width: '400px', textAlign: 'center' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.2rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>A.dot</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>행정·인사 업무 지원 시스템</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '12px',
              border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
            }}
            required
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '12px',
              border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
            }}
            required
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            style={{ accentColor: 'var(--primary)' }}
          />
          <label htmlFor="remember" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>로그인 정보 저장</label>
        </div>

        {error && <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '1.2rem', borderRadius: '16px', border: 'none', background: 'var(--primary-gradient)',
            color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
          }}
          onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 242, 254, 0.2)'; }}
          onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.4)'; }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
          시스템 접속
        </button>
      </form>
    </div>
  );
};

export default Login;
