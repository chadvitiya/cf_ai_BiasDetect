import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ showBack, onBack }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={onBack}
                className="p-1.5 hover:bg-orange-500/10 rounded transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={18} className="text-neutral-700 dark:text-neutral-300" />
              </button>
            )}
            <h1 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
              BiasHunter
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 hover:bg-orange-500/10 rounded transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon size={18} className="text-neutral-700" />
            ) : (
              <Sun size={18} className="text-neutral-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
