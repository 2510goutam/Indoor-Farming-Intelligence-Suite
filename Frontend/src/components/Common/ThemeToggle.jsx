import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 border shadow-sm flex items-center justify-center 
                ${theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 shadow-amber-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-slate-200/50'
                } 
                ${className}`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 animate-pulse" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
};

export default ThemeToggle;
