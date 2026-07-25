import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bot, Eye, EyeOff, ArrowRight, Award, Zap, ArrowLeft } from 'lucide-react';
import { login } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

// Mobile Login Component
const MobileLogin = ({ formData, showPassword, rememberMe, loading, authLoading, handleChange, setShowPassword, setRememberMe, handleSubmit }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px 16px', backgroundColor: '#0B1220' }}>
      {/* Back to Home Link */}
      <Link 
        to="/" 
        style={{ 
          position: 'absolute', 
          top: '24px', 
          left: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: '#9CA3AF', 
          textDecoration: 'none', 
          fontSize: '14px',
          fontWeight: 500 
        }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        <span>Back to Home</span>
      </Link>

      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(to bottom right, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
          <Bot style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>InterviewAI</span>
      </div>

      {/* Form Container */}
      <div style={{ width: '100%', maxWidth: '420px', padding: '24px', borderRadius: '20px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Welcome Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 'bold', color: 'white', marginBottom: '8px', lineHeight: '1.2' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#9CA3AF', lineHeight: '1.5' }}>
            Sign in to continue your AI interview preparation.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#D1D5DB', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', height: '56px', padding: '0 16px', backgroundColor: '#0B1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }}
              placeholder="you@example.com"
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#D1D5DB', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', height: '56px', padding: '0 48px 0 16px', backgroundColor: '#0B1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }}
                placeholder="••••••••"
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: '#0B1220', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: '#9CA3AF' }}>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              style={{ fontSize: '14px', color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            style={{ width: '100%', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(to right, #3B82F6, #06B6D4)', color: 'white', borderRadius: '12px', border: 'none', cursor: (loading || authLoading) ? 'not-allowed' : 'pointer', opacity: (loading || authLoading) ? 0.5 : 1, fontSize: '16px', fontWeight: 500, transition: 'opacity 0.2s, transform 0.2s' }}
            onMouseOver={(e) => !loading && !authLoading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading || authLoading ? (
              <>
                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '14px', color: '#9CA3AF' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Register Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Desktop Login Component
const DesktopLogin = ({ formData, showPassword, rememberMe, loading, authLoading, handleChange, setShowPassword, setRememberMe, handleSubmit }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#0B1220' }}>
      <div style={{ width: '100%', maxWidth: '1200px', minHeight: '700px', backgroundColor: '#1E293B', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', minHeight: '700px' }}>
          {/* Left Section - Branding */}
          <div style={{ padding: '2rem 3rem', background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'linear-gradient(to bottom right, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.25)' }}>
                  <Bot style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>InterviewAI</span>
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', lineHeight: '1.2' }}>
                  Welcome Back
                </h1>
                <p style={{ fontSize: '1.125rem', color: '#9CA3AF', lineHeight: '1.6' }}>
                  Sign in to continue your interview preparation journey with AI-powered coaching.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>50K+</div>
                  <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Users</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>100K+</div>
                  <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Interviews</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>95%</div>
                  <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Success</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot style={{ width: '1.5rem', height: '1.5rem', color: '#60A5FA' }} />
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600 }}>AI-Powered Interviews</div>
                    <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Practice with intelligent AI</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award style={{ width: '1.5rem', height: '1.5rem', color: '#22D3EE' }} />
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600 }}>Earn Certificates</div>
                    <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Showcase your achievements</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap style={{ width: '1.5rem', height: '1.5rem', color: '#A78BFA' }} />
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600 }}>Real-time Feedback</div>
                    <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Improve instantly</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
              © {new Date().getFullYear()} InterviewAI. All rights reserved.
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div style={{ padding: '2rem 3rem', backgroundColor: '#0B1220', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '450px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                  Sign In
                </h2>
                <p style={{ color: '#9CA3AF' }}>
                  Enter your credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '0.5rem' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '0.5rem' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', outline: 'none', paddingRight: '3rem' }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
                    >
                      {showPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ width: '1rem', height: '1rem', borderRadius: '0.25rem', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: '#1E293B' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    style={{ fontSize: '0.875rem', color: '#60A5FA', textDecoration: 'none' }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading || authLoading}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #3B82F6, #06B6D4)', color: 'white', borderRadius: '0.75rem', border: 'none', cursor: (loading || authLoading) ? 'not-allowed' : 'pointer', opacity: (loading || authLoading) ? 0.5 : 1, fontSize: '1rem', fontWeight: 500, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.25)' }}
                >
                  {loading || authLoading ? (
                    <>
                      <div style={{ width: '1.25rem', height: '1.25rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#9CA3AF' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}>
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await dispatch(login(formData)).unwrap();
      toast.success('Login successful!');
      
      if (result.data?.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const sharedProps = {
    formData,
    showPassword,
    rememberMe,
    loading,
    authLoading,
    handleChange,
    setShowPassword,
    setRememberMe,
    handleSubmit,
  };

  return isMobile ? <MobileLogin {...sharedProps} /> : <DesktopLogin {...sharedProps} />;
};

export default Login;
