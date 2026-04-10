import { motion } from 'framer-motion';
import { Zap, Brain, Code2, Globe, Sparkles, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const capabilities = [
  { icon: Brain, title: 'Deep Reasoning', desc: 'Complex analysis and logic', color: '#00d4ff' },
  { icon: Code2, title: 'Code Generation', desc: 'Any language, any framework', color: '#7c3aed' },
  { icon: Globe, title: 'World Knowledge', desc: 'Vast information access', color: '#ec4899' },
  { icon: MessageSquare, title: 'Natural Chat', desc: 'Human-like conversation', color: '#10b981' },
];

export const EmptyState = ({ onQuickSend }: { onQuickSend: (msg: string) => void }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const prompts = [
    { text: 'Explain how neural networks learn', icon: '🧠' },
    { text: 'Write a REST API in FastAPI', icon: '⚡' },
    { text: 'Best practices for React 2024', icon: '⚛️' },
    { text: 'How does GPT attention work?', icon: '🔭' },
    { text: 'Debug this Python code for me', icon: '🐛' },
    { text: 'Design a scalable microservices architecture', icon: '🏗️' },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8"
      >
        {/* Animated logo orb */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Outer rings */}
          {[80, 60, 44].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: size, height: size,
                borderColor: i === 0 ? 'rgba(0,212,255,0.12)' : i === 1 ? 'rgba(124,58,237,0.15)' : 'rgba(236,72,153,0.12)',
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.04, 1] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* Center orb */}
          <motion.div
            className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              border: '1px solid rgba(0,212,255,0.3)',
              boxShadow: '0 0 40px rgba(0,212,255,0.2)',
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(0,212,255,0.2)',
                '0 0 40px rgba(124,58,237,0.3)',
                '0 0 20px rgba(0,212,255,0.2)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap className="w-6 h-6 text-cyan-400" />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`text-xl font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
        >
          {greeting()}, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'there'}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
        >
          What shall we explore today?
        </motion.p>
      </motion.div>

      {/* Capability cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-2 gap-2.5 w-full max-w-sm mb-6"
      >
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className={`p-3 rounded-xl border cursor-default ${
              isDark
                ? 'bg-white/[0.03] border-white/[0.07] hover:border-white/15'
                : 'bg-white/70 border-purple-50 hover:border-purple-200 shadow-sm'
            } transition-all duration-200`}
          >
            <cap.icon className="w-4 h-4 mb-2" style={{ color: cap.color }} />
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{cap.title}</p>
            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{cap.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick prompts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm space-y-1.5"
      >
        <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Try asking
        </p>
        {prompts.map((p, i) => (
          <motion.button
            key={p.text}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + i * 0.04 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onQuickSend(p.text)}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs text-left border transition-all duration-200 group ${
              isDark
                ? 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] hover:border-cyan-500/20'
                : 'bg-white/60 border-purple-50 text-slate-500 hover:text-slate-700 hover:bg-white/90 hover:border-purple-200 shadow-sm'
            }`}
          >
            <span className="text-sm">{p.icon}</span>
            <span className="flex-1">{p.text}</span>
            <Sparkles className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-cyan-400' : 'text-purple-400'}`} />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
