import { Link } from 'react-router-dom';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

const ServerError = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#0B1220' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ width: '6rem', height: '6rem', margin: '0 auto 1.5rem', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle style={{ width: '3rem', height: '3rem', color: '#F59E0B' }} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#F59E0B', lineHeight: 1, marginBottom: '0.5rem' }}>
            500
          </h1>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            Server Error
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '1.125rem' }}>
            Something went wrong on our end. Please try again later.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => window.location.reload()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #3B82F6, #06B6D4)', color: 'white', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.25)' }}
          >
            <RefreshCw style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Try Again</span>
          </button>
          
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}
          >
            <Home style={{ width: '1rem', height: '1rem' }} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#F59E0B' }} />
            <span style={{ color: 'white', fontWeight: 500 }}>What happened?</span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
            Our servers encountered an unexpected error. Our team has been notified and is working to fix it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
