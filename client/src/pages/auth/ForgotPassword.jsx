import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../redux/slices/authSlice';
import { Bot, Mail, ArrowLeft, ArrowRight, CheckCircle, Award, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: authLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(forgotPassword(email)).unwrap();
      toast.success('Password reset OTP sent!');
      setSubmitted(true);
    } catch (error) {
      toast.error(error || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  const goToResetPassword = () => {
    navigate('/reset-password', { state: { email } });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#0B1220' }}>
      <div style={{ width: '100%', maxWidth: '1200px', minHeight: '700px', backgroundColor: '#1E293B', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: '700px' }}>
          {/* Left Section - Branding */}
          <div style={{ width: '55%', padding: '2rem 3rem', background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                  Forgot Password?
                </h1>
                <p style={{ fontSize: '1.125rem', color: '#9CA3AF', lineHeight: '1.6' }}>
                  No worries, we'll send you an OTP to reset your password.
                </p>
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

          {/* Right Section - Forgot Password Form */}
          <div style={{ width: '45%', padding: '2rem 3rem', backgroundColor: '#0B1220', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '450px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                  Reset Password
                </h2>
                <p style={{ color: '#9CA3AF' }}>
                  Enter your email to receive reset OTP
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '0.5rem' }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                        placeholder="you@example.com"
                      />
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
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center' }}>
                    <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}>
                      <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                      <span>Back to Login</span>
                    </Link>
                  </div>
                </form>
              ) : (
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ width: '4rem', height: '4rem', margin: '0 auto', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail style={{ width: '2rem', height: '2rem', color: '#4ADE80' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>Check Your Email</h3>
                    <p style={{ color: '#9CA3AF' }}>
                      We've sent a 6-digit OTP to <span style={{ color: '#60A5FA' }}>{email}</span>
                    </p>
                  </div>
                  <button
                    onClick={goToResetPassword}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #3B82F6, #06B6D4)', color: 'white', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.25)' }}
                  >
                    <span>Enter OTP & Reset Password</span>
                    <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                  </button>
                  <Link
                    to="/login"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}
                  >
                    <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                    <span>Back to Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
