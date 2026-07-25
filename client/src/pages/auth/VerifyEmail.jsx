import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../../redux/slices/authSlice';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        await dispatch(verifyEmail(token)).unwrap();
        setStatus('success');
        toast.success('Email verified successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (error) {
        setStatus('error');
        toast.error(error || 'Email verification failed');
      }
    };

    verify();
  }, [token, dispatch, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-center space-y-6"
    >
      {status === 'loading' && (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[rgba(37,99,235,0.1)] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[var(--color-primary-blue)] animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">Verifying Email...</h3>
            <p className="text-[var(--color-text-muted)]">Please wait while we verify your email address</p>
          </div>
        </div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[var(--color-success)]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">Email Verified!</h3>
            <p className="text-[var(--color-text-muted)]">Your email has been successfully verified. Redirecting to dashboard...</p>
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
            <XCircle className="w-8 h-8 text-[var(--color-error)]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">Verification Failed</h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              The verification link is invalid or has expired. Please request a new verification email.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="glass-button w-full"
          >
            Go to Dashboard
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VerifyEmail;
