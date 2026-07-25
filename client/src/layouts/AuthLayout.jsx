import { Outlet, Link } from 'react-router-dom';
import { Bot, ArrowLeft, HelpCircle } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] w-full flex flex-col">
      {/* Minimal Auth Header - Hidden on mobile for pages with their own mobile layout */}
      <header className="hidden md:flex items-center justify-between px-4 py-4 md:px-8 border-b border-[var(--color-border)] bg-[var(--color-navbar)]/80 backdrop-blur-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 no-underline">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center">
            <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <span className="text-base md:text-xl font-bold text-[var(--color-text-heading)] tracking-tight">
            InterviewAI
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="hidden sm:flex items-center gap-2 text-[var(--color-text-muted)] no-underline text-sm font-medium hover:text-[var(--color-text-heading)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <a 
            href="#" 
            className="hidden sm:flex items-center gap-2 text-[var(--color-text-muted)] no-underline text-sm font-medium hover:text-[var(--color-text-heading)] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Need Help?</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
