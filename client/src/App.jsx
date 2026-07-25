import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './layouts/Layout';
import PremiumLayout from './components/layout/PremiumLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import ProtectedLayout from './components/guards/ProtectedLayout';
import AdminProtectedLayout from './components/guards/AdminProtectedLayout';
import AdminRoute from './components/guards/AdminRoute';
import SkeletonLoader from './components/ui/SkeletonLoader';
import NotFound from './pages/errors/NotFound';
import Forbidden from './pages/errors/Forbidden';
import ServerError from './pages/errors/ServerError';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/admin/Toast';
import ThemeProvider from './contexts/ThemeContext';

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));

// Public Pages
const Landing = lazy(() => import('./pages/public/Landing'));
const Features = lazy(() => import('./pages/public/Features'));
const HowItWorks = lazy(() => import('./pages/public/HowItWorks'));
const About = lazy(() => import('./pages/public/About'));
const FAQ = lazy(() => import('./pages/public/FAQ'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Main Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const InterviewGenerator = lazy(() => import('./pages/InterviewGenerator'));
const InterviewInterface = lazy(() => import('./pages/InterviewInterface'));
const ConversationalInterview = lazy(() => import('./pages/interview/ConversationalInterview'));
const CodingInterview = lazy(() => import('./pages/coding/CodingInterview'));
const CodingInterviewGenerator = lazy(() => import('./pages/coding/CodingInterviewGenerator'));
const CompanyInterview = lazy(() => import('./pages/CompanyInterview'));
const VoiceInterview = lazy(() => import('./pages/VoiceInterview'));
const Gamification = lazy(() => import('./pages/Gamification'));
const InterviewReport = lazy(() => import('./pages/InterviewReport'));
const InterviewHistory = lazy(() => import('./pages/InterviewHistory'));
const Profile = lazy(() => import('./pages/Profile'));
const ResumeUpload = lazy(() => import('./pages/ResumeUpload'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Notes = lazy(() => import('./pages/Notes'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Settings = lazy(() => import('./pages/Settings'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const ResumeList = lazy(() => import('./pages/ResumeList'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const InterviewManagement = lazy(() => import('./pages/admin/InterviewManagement'));
const AIProviders = lazy(() => import('./pages/admin/AIProviders'));
const GamificationManagement = lazy(() => import('./pages/admin/GamificationManagement'));
const NotificationCenter = lazy(() => import('./pages/admin/NotificationCenter'));
const AdminCertificates = lazy(() => import('./pages/admin/Certificates'));
const ActivityLogs = lazy(() => import('./pages/admin/ActivityLogs'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Suspense fallback={<SkeletonLoader type="card" count={3} />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Landing />} />
              <Route path="features" element={<Features />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              <Route path="about" element={<About />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<AuthLayout />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/register" element={<AuthLayout />}>
              <Route index element={<Register />} />
            </Route>
            <Route path="/forgot-password" element={<AuthLayout />}>
              <Route index element={<ForgotPassword />} />
            </Route>
            <Route path="/reset-password" element={<AuthLayout />}>
              <Route index element={<ResetPassword />} />
            </Route>
            <Route path="/verify-email/:token" element={<AuthLayout />}>
              <Route index element={<VerifyEmail />} />
            </Route>

            {/* Error Pages */}
            <Route path="/404" element={<NotFound />} />
            <Route path="/403" element={<Forbidden />} />
            <Route path="/500" element={<ServerError />} />

            {/* Private Routes - Candidate */}
            <Route path="/dashboard" element={<ProtectedLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="interview/generator" element={<InterviewGenerator />} />
              <Route path="interview/coding/generator" element={<CodingInterviewGenerator />} />
              <Route path="company-interview" element={<CompanyInterview />} />
              <Route path="company-interview/:id" element={<CompanyInterview />} />
              <Route path="voice-interview" element={<VoiceInterview />} />
              <Route path="voice-interview/:id" element={<VoiceInterview />} />
              <Route path="gamification" element={<Gamification />} />
              <Route path="interview/conversational/:id" element={<ConversationalInterview />} />
              <Route path="interview/coding/:id" element={<CodingInterview />} />
              <Route path="interview/:id" element={<InterviewInterface />} />
              <Route path="interview/report/:id" element={<InterviewReport />} />
              <Route path="interview/history" element={<InterviewHistory />} />
              <Route path="profile" element={<Profile />} />
              <Route path="resume/upload" element={<ResumeUpload />} />
              <Route path="resume/builder" element={<ResumeList />} />
              <Route path="resume/builder/:id" element={<ResumeBuilder />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="notes" element={<Notes />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminProtectedLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="interviews" element={<InterviewManagement />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="ai-providers" element={<AIProviders />} />
              <Route path="gamification" element={<GamificationManagement />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="notifications" element={<NotificationCenter />} />
              <Route path="logs" element={<ActivityLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </Suspense>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
