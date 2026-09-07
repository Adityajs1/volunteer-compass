import { createContext, useContext, useState, useCallback } from 'react';
import { T } from '../theme';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Render Wrapper */}
      <div style={{
        position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10,
        zIndex: 9999, pointerEvents: 'none'
      }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            background: t.type === 'error' ? '#EF4444' : T.ink,
            color: '#fff',
            padding: '12px 24px', borderRadius: 12,
            fontWeight: 600, fontSize: '0.88rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
            animation: 'toastIn 0.3s ease',
          }}>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
