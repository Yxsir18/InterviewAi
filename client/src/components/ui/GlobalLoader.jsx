import { Bot } from 'lucide-react';

const GlobalLoader = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B1220' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '5rem', height: '5rem', margin: '0 auto 1.5rem' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(59, 130, 246, 0.2)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#3B82F6', animation: 'spin 1s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '0.5rem', borderRadius: '50%', border: '3px solid transparent, border-topColor: #06B6D4', animation: 'spin 0.8s linear infinite reverse' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Bot style={{ width: '2rem', height: '2rem', color: '#60A5FA' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>InterviewAI</span>
        </div>
        
        <p style={{ color: '#9CA3AF', fontSize: '1rem' }}>Loading...</p>
      </div>
      
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;
