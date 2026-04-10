import { motion } from 'framer-motion';
import { Sun, Moon, Zap, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

interface TopbarProps {
  conversationTitle?: string;
  sidebarOpen: boolean;
}

export const Topbar = ({ conversationTitle, sidebarOpen }: TopbarProps) => {
  const { isDark, toggleTheme } = useTheme();
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <header
      className={`flex-shrink-0 flex items-center justify-between px-4 py-3 border-b ${
        isDark ? 'border-white/[0.05] bg-transparent' : 'border-purple-100/80 bg-transparent'
      }`}
    >
      {/* Left: title */}
      <motion.div
        className="flex items-center gap-2 min-w-0"
        animate={{ paddingLeft: sidebarOpen ? 0 : 28 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {conversationTitle ? (
          <motion.p
            key={conversationTitle}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm font-semibold truncate max-w-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            {conversationTitle}
          </motion.p>
        ) : (
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-purple-500'}`} />
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              New Chat
            </span>
          </div>
        )}
      </motion.div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Online indicator */}
        <div className="flex items-center gap-1.5">
          {online ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span className={`text-[10px] font-medium ${online ? 'text-emerald-400' : 'text-rose-400'}`}>
            {online ? 'Connected' : 'Offline'}
          </span>
        </div>

        {/* Model badge */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${
            isDark
              ? 'border-cyan-500/25 bg-cyan-500/8 text-cyan-400'
              : 'border-purple-200 bg-purple-50 text-purple-600'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-cyan-400' : 'bg-purple-500'}`} />
          Neural v2
        </div>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`p-2 rounded-xl border transition-colors ${
            isDark
              ? 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-yellow-300 hover:border-yellow-400/30'
              : 'border-purple-100 bg-white/60 text-slate-500 hover:text-purple-600 hover:border-purple-300'
          }`}
          title="Toggle theme"
        >
          <motion.div
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </motion.div>
        </motion.button>
      </div>
    </header>
  );
};
