import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center transition-all hover:bg-[var(--color-hover)]"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-[var(--color-text-body)]" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--color-text-body)]" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
