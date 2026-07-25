import { Link } from 'react-router-dom';
import { Shield, Home, LogOut } from 'lucide-react';

const Forbidden = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#0B1220' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ width: '6rem', height: '6rem', margin: '0 auto 1.5rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield style={{ width: '3rem', height: '3rem', color: '#EF4444' }} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#EF4444', lineHeight: 1, marginBottom: '0.5rem' }}>
            403
          </h1>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            Access Denied
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '1.125rem' }}>
            You don't have permission to access this page.
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
            <LogOut style={{ width: '1rem', height: '1rem' }} />
            <span>Login with Different Account</span>
          </Link>
        </div>

        <div style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Shield style={{ width: '1.25rem', height: '1.25rem', color: '#EF4444' }} />
            <span style={{ color: 'white', fontWeight: 500 }}>Why am I seeing this?</span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
            This page requires special permissions. Contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
