import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface InputBoxProps {
  onSend: (message: string) => void;
  isTyping: boolean;
  disabled?: boolean;
}

export const InputBox = ({ onSend, isTyping, disabled }: InputBoxProps) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isDark } = useTheme();

  const handleSend = useCallback(() => {
    const msg = input.trim();
    if (!msg || isTyping || disabled) return;
    onSend(msg);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input, isTyping, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  const hasInput = input.trim().length > 0;

  const suggestions = [
    'Explain quantum computing',
    'Write a Python function',
    'Summarize recent AI news',
    'Help debug my code',
  ];

  return (
    <div className="relative">
      {/* Suggestion chips (only when empty + focused) */}
      <AnimatePresence>
        {!hasInput && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2 mb-2.5 px-1"
          >
            {suggestions.map((s) => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 font-medium ${
                  isDark
                    ? 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-cyan-500/30 hover:text-cyan-300 hover:bg-cyan-500/5'
                    : 'border-purple-100 bg-white/60 text-slate-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input container */}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? isDark
              ? '0 0 0 1px rgba(0,212,255,0.35), 0 0 32px rgba(0,212,255,0.12), 0 8px 32px rgba(0,0,0,0.3)'
              : '0 0 0 1px rgba(124,58,237,0.35), 0 0 32px rgba(124,58,237,0.08), 0 8px 32px rgba(0,0,0,0.08)'
            : isDark
              ? '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.2)'
              : '0 0 0 1px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.06)',
        }}
        transition={{ duration: 0.3 }}
        className={`flex items-end gap-2 rounded-2xl px-3 py-3 ${isDark ? 'bg-white/[0.05]' : 'bg-white/80'}`}
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        {/* Attach button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`mb-0.5 p-1.5 rounded-xl transition-colors flex-shrink-0 ${
            isDark ? 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10' : 'text-slate-400 hover:text-purple-500 hover:bg-purple-50'
          }`}
          title="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </motion.button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask Neural anything..."
          rows={1}
          disabled={isTyping || disabled}
          className={`flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed max-h-40 ${
            isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'
          }`}
          style={{ scrollbarWidth: 'none' }}
        />

        {/* Right actions */}
        <div className="flex items-center gap-1 flex-shrink-0 mb-0.5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark ? 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10' : 'text-slate-400 hover:text-purple-500 hover:bg-purple-50'
            }`}
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </motion.button>

          {/* Send button */}
          <motion.button
            onClick={handleSend}
            disabled={!hasInput || isTyping || disabled}
            whileHover={hasInput && !isTyping ? { scale: 1.08 } : {}}
            whileTap={hasInput && !isTyping ? { scale: 0.92 } : {}}
            className={`relative p-2 rounded-xl transition-all duration-300 overflow-hidden ${
              hasInput && !isTyping
                ? 'opacity-100 cursor-pointer'
                : 'opacity-35 cursor-not-allowed'
            }`}
            style={
              hasInput && !isTyping
                ? {
                    background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
                    boxShadow: '0 0 20px rgba(0,212,255,0.3)',
                  }
                : { background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }
            }
            title="Send (Enter)"
          >
            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.div key="loading" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </motion.div>
              ) : (
                <motion.div key="send" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                  <Send className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shimmer on hover */}
            {hasInput && !isTyping && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Hint */}
      <p className={`text-center text-[10px] mt-2 ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>
        Press <kbd className={`px-1 py-0.5 rounded-md text-[9px] font-mono ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>Enter</kbd> to send · <kbd className={`px-1 py-0.5 rounded-md text-[9px] font-mono ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};
