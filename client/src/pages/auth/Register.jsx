import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bot, User, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle, Award, Zap, ArrowLeft } from 'lucide-react';
import { register } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

// Mobile Register Component
const MobileRegister = ({ formData, showPassword, showConfirmPassword, loading, authLoading, handleChange, setShowPassword, setShowConfirmPassword, handleSubmit }) => {
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
            Create Account
          </h1>
          <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#9CA3AF', lineHeight: '1.5' }}>
            Join thousands of candidates preparing for their dream jobs.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#D1D5DB', marginBottom: '8px' }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', height: '56px', padding: '0 16px', backgroundColor: '#0B1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }}
              placeholder="John Doe"
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

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

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#D1D5DB', marginBottom: '8px' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ width: '100%', height: '56px', padding: '0 48px 0 16px', backgroundColor: '#0B1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }}
                placeholder="••••••••"
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {showConfirmPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
              </button>
            </div>
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
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
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

        {/* Login Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Desktop Register Component
const DesktopRegister = ({ formData, showPassword, showConfirmPassword, loading, authLoading, handleChange, setShowPassword, setShowConfirmPassword, handleSubmit }) => {
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
                  Create Account
                </h1>
                <p style={{ fontSize: '1.125rem', color: '#9CA3AF', lineHeight: '1.6' }}>
                  Join thousands of candidates preparing for their dream jobs with AI-powered coaching.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#4ADE80' }} />
                  <span style={{ color: 'white' }}>Free to get started</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#4ADE80' }} />
                  <span style={{ color: 'white' }}>AI-powered interviews</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#4ADE80' }} />
                  <span style={{ color: 'white' }}>Real-time feedback</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#4ADE80' }} />
                  <span style={{ color: 'white' }}>Earn certificates</span>
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

          {/* Right Section - Register Form */}
          <div style={{ padding: '2rem 3rem', backgroundColor: '#0B1220', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '450px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                  Sign Up
                </h2>
                <p style={{ color: '#9CA3AF' }}>
                  Create your account to get started
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '0.5rem' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '0.5rem' }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '0.5rem' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', outline: 'none', paddingRight: '3rem' }}
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '0.5rem' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', outline: 'none', paddingRight: '3rem' }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
                    >
                      {showConfirmPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || authLoading}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #3B82F6, #06B6D4)', color: 'white', borderRadius: '0.75rem', border: 'none', cursor: (loading || authLoading) ? 'not-allowed' : 'pointer', opacity: (loading || authLoading) ? 0.5 : 1, fontSize: '1rem', fontWeight: 500, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.25)' }}
                >
                  {loading || authLoading ? (
                    <>
                      <div style={{ width: '1.25rem', height: '1.25rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#9CA3AF' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}>
                    Sign in
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })).unwrap();
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const sharedProps = {
    formData,
    showPassword,
    showConfirmPassword,
    loading,
    authLoading,
    handleChange,
    setShowPassword,
    setShowConfirmPassword,
    handleSubmit,
  };

  return isMobile ? <MobileRegister {...sharedProps} /> : <DesktopRegister {...sharedProps} />;
};

export default Register;
