import { useState } from 'react';
import { forgotPasswordApi } from '../api/auth.api';
import { useToast } from '../context/ToastContext';
import { T } from '../theme';

export default function ForgotPassword({ setPage }) {
  const { addToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return addToast('Please enter your email', 'error');

    setLoading(true);
    try {
      await forgotPasswordApi(email);
      setSent(true);
      addToast('Reset link sent', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '40px 32px', background: T.white, border: `1px solid ${T.border}`, borderRadius: 24 }}>
      {sent ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📩</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '1.8rem', color: T.ink, marginBottom: 8 }}>Check your email</h2>
          <p style={{ color: T.muted, marginBottom: 32, fontSize: '0.9rem', lineHeight: 1.6 }}>
            We've sent a password reset link to <strong>{email}</strong>.
          </p>
          <button onClick={() => setPage('login')} style={{ background: T.leaf, color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', width: '100%' }}>
            Return to Login
          </button>
        </div>
      ) : (
        <>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '2rem', color: T.ink, marginBottom: 8, textAlign: 'center' }}>Reset Password</h2>
          <p style={{ textAlign: 'center', color: T.muted, marginBottom: 32, fontSize: '0.9rem' }}>Enter your email to receive a reset link.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.cream, outline: 'none', marginTop: 6 }}
                placeholder="you@example.com"
              />
            </div>

            <button type="submit" disabled={loading} style={{ background: T.leaf, color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}>
              {loading ? 'Sending link...' : 'Send Reset Link →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: T.muted }}>
            Remember your password? <span onClick={() => setPage('login')} style={{ color: T.leaf, fontWeight: 700, cursor: 'pointer' }}>Log in</span>
          </div>
        </>
      )}
    </div>
  );
}
