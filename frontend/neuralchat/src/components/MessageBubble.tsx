import { motion } from 'framer-motion';
import { Zap, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export const MessageBubble = ({ message, index }: MessageBubbleProps) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Detect and render code blocks simply
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).replace(/^\w+\n/, '');
        return (
          <pre key={i} className={`my-2 p-3 rounded-xl text-xs overflow-x-auto font-mono ${isDark ? 'bg-black/40 border border-cyan-500/15 text-cyan-100' : 'bg-slate-100 border border-purple-100 text-slate-700'}`}>
            {code}
          </pre>
        );
      }
      // Handle inline code
      const inlineParts = part.split(/(`[^`]+`)/g);
      return (
        <span key={i}>
          {inlineParts.map((ip, j) =>
            ip.startsWith('`') && ip.endsWith('`') ? (
              <code key={j} className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${isDark ? 'bg-cyan-500/10 text-cyan-300' : 'bg-purple-100 text-purple-700'}`}>
                {ip.slice(1, -1)}
              </code>
            ) : (
              <span key={j}>{ip}</span>
            )
          )}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: index < 10 ? index * 0.03 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              border: '1px solid rgba(0,212,255,0.25)',
              color: '#00d4ff',
            }}
          >
            <User className="w-3.5 h-3.5" />
          </div>
        ) : (
          <motion.div
            className="w-8 h-8 rounded-xl flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
            animate={{
              boxShadow: [
                '0 0 8px rgba(0,212,255,0.15)',
                '0 0 16px rgba(124,58,237,0.2)',
                '0 0 8px rgba(0,212,255,0.15)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </motion.div>
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[78%]`}>
        <motion.div
          className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? isDark
                ? 'bg-gradient-to-br from-cyan-500/15 to-purple-500/15 border border-cyan-500/20 text-slate-100'
                : 'bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200 text-slate-800'
              : isDark
                ? 'bg-white/[0.04] border border-white/[0.07] text-slate-100'
                : 'bg-white/80 border border-purple-100 text-slate-700'
          } msg-bubble`}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15 }}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            ...(isUser && isDark ? { boxShadow: '0 4px 20px rgba(0,212,255,0.08)' } : {}),
          }}
        >
          {/* Message content */}
          <div className="msg-content whitespace-pre-wrap break-words">
            {renderContent(message.content)}
          </div>

          {/* Glow line for user messages */}
          {isUser && (
            <div
              className="absolute bottom-0 left-4 right-4 h-px rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }}
            />
          )}
        </motion.div>

        {/* Timestamp + actions */}
        <div className={`flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            {formatTime(message.timestamp)}
          </span>
          <motion.button
            onClick={copy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-1 rounded-md transition-colors ${isDark ? 'text-slate-600 hover:text-cyan-400' : 'text-slate-400 hover:text-purple-500'}`}
            title="Copy"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export const TypingIndicator = () => {
  const { isDark } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="flex gap-3 mb-4"
    >
      <motion.div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
          border: '1px solid rgba(0,212,255,0.2)',
        }}
        animate={{ boxShadow: ['0 0 8px rgba(0,212,255,0.15)', '0 0 20px rgba(124,58,237,0.25)', '0 0 8px rgba(0,212,255,0.15)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap className="w-3.5 h-3.5 text-cyan-400" />
      </motion.div>

      <div
        className={`px-4 py-3.5 rounded-2xl flex items-center gap-1.5 ${isDark ? 'bg-white/[0.04] border border-white/[0.07]' : 'bg-white/80 border border-purple-100'}`}
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`typing-dot w-1.5 h-1.5 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-purple-500'}`}
          />
        ))}
        <span className={`text-xs ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Thinking...</span>
      </div>
    </motion.div>
  );
};
