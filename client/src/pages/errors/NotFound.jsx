import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#0B1220' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '8rem', fontWeight: 'bold', color: '#3B82F6', lineHeight: 1, marginBottom: '1rem' }}>
            404
          </h1>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            Page Not Found
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '1.125rem' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #3B82F6, #06B6D4)', color: 'white', borderRadius: '0.75rem', border: 'none', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.25)' }}
          >
            <Home style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Back to Home</span>
          </Link>
          
          <Link
            to="/login"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            <span>Go to Login</span>
          </Link>
        </div>

        <div style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Search style={{ width: '1.25rem', height: '1.25rem', color: '#60A5FA' }} />
            <span style={{ color: 'white', fontWeight: 500 }}>Looking for something?</span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
            Try checking the URL or navigate using the menu above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
