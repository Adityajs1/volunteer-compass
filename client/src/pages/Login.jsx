import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { T } from '../theme';

export default function Login({ setPage }) {
  const { login } = useAuth();
  const { addToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return addToast('Please fill all fields', 'error');

    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
      setPage('dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '40px 32px', background: T.white, border: `1px solid ${T.border}`, borderRadius: 24 }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '2rem', color: T.ink, marginBottom: 8, textAlign: 'center' }}>Welcome Back</h2>
      <p style={{ textAlign: 'center', color: T.muted, marginBottom: 32, fontSize: '0.9rem' }}>Enter your details to access your dashboard.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase' }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.cream, outline: 'none', marginTop: 6 }}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase' }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.cream, outline: 'none', marginTop: 6 }}
            placeholder="••••••••"
          />
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <span onClick={() => setPage('forgot-password')} style={{ fontSize: '0.8rem', color: T.leaf, fontWeight: 700, cursor: 'pointer' }}>Forgot Password?</span>
        </div>

        <button type="submit" disabled={loading} style={{ background: T.leaf, color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}>
          {loading ? 'Logging in...' : 'Log In →'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: T.muted }}>
        Don't have an account? <span onClick={() => setPage('signup')} style={{ color: T.leaf, fontWeight: 700, cursor: 'pointer' }}>Sign up</span>
      </div>
    </div>
  );
}
