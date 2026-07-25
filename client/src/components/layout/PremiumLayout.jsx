import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PremiumSidebar from './PremiumSidebar';
import PremiumTopNav from './PremiumTopNav';
import PageTransition from './PageTransition';
import { getSettings, setTheme } from '../../redux/slices/settingsSlice';

const PremiumLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.settings);
  const isDarkMode = settings.theme === 'dark';

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load settings on mount
    dispatch(getSettings());
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, [dispatch]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <PremiumSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
        isMobile={isMobile}
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <PremiumTopNav 
          user={user}
          onMenuToggle={toggleSidebar}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          isMobile={isMobile}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PremiumLayout;
