import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight,
  Zap, LogOut, Cpu,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import type { Conversation } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  currentId: number | null;
  onNewChat: () => void;
  onSelectChat: (id: number) => void;
  onDeleteChat: (id: number) => void;
  onFetchConversations: () => void;
}

export const Sidebar = ({
  isOpen, onToggle, conversations, currentId,
  onNewChat, onSelectChat, onDeleteChat, onFetchConversations,
}: SidebarProps) => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    onFetchConversations();
  }, []);

  const bg = isDark
    ? 'bg-[#060c1a]/90 border-white/[0.06]'
    : 'bg-white/80 border-purple-100';

  const textPrimary = isDark ? 'text-slate-200' : 'text-slate-700';
  const textMuted = isDark ? 'text-slate-500' : 'text-slate-400';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return 'Today';
    if (diff < 172800000) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group conversations by date
  const grouped = conversations.reduce<Record<string, Conversation[]>>((acc, c) => {
    const label = formatDate(c.updated_at || c.created_at);
    if (!acc[label]) acc[label] = [];
    acc[label].push(c);
    return acc;
  }, {});

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`relative z-30 h-full flex-shrink-0 border-r backdrop-blur-xl overflow-hidden ${bg}`}
      >
        <div className="w-[260px] h-full flex flex-col">
          {/* Header */}
          <div className="p-4 flex items-center gap-3 border-b border-white/[0.06]">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
                border: '1px solid rgba(0,212,255,0.25)',
              }}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <span className={`font-display text-sm font-bold tracking-widest gradient-text`}>NEURAL</span>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewChat}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,58,237,0.12))',
                border: '1px solid rgba(0,212,255,0.2)',
                color: isDark ? '#67e8f9' : '#7c3aed',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
              <Plus className="w-4 h-4" />
              New conversation
            </motion.button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {conversations.length === 0 ? (
              <div className={`text-center py-8 text-xs ${textMuted}`}>
                <Cpu className="w-6 h-6 mx-auto mb-2 opacity-40" />
                No conversations yet
              </div>
            ) : (
              Object.entries(grouped).map(([label, convs]) => (
                <div key={label} className="mb-3">
                  <p className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1.5 ${textMuted}`}>
                    {label}
                  </p>
                  {convs.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === currentId}
                      onSelect={() => onSelectChat(conv.id)}
                      onDelete={() => onDeleteChat(conv.id)}
                      isDark={isDark}
                      textPrimary={textPrimary}
                      textMuted={textMuted}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className={`p-3 border-t ${isDark ? 'border-white/[0.06]' : 'border-purple-100'}`}>
            {/* User info */}
            <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl mb-1 ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-purple-50'} transition-colors cursor-pointer`}>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #00d4ff30, #7c3aed30)', color: '#00d4ff' }}
              >
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${textPrimary}`}>{user?.full_name || 'User'}</p>
                <p className={`text-[10px] truncate ${textMuted}`}>{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-xl text-xs transition-colors hover:text-rose-400 ${textMuted}`}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Toggle button */}
      <motion.button
        onClick={onToggle}
        className={`absolute top-4 z-40 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${
          isDark ? 'bg-slate-800/90 border border-white/10 text-slate-300 hover:text-cyan-400' : 'bg-white border border-purple-100 text-slate-500 hover:text-purple-600'
        }`}
        style={{ left: isOpen ? 246 : 12 }}
        animate={{ left: isOpen ? 246 : 12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </motion.button>
    </>
  );
};

const ConversationItem = ({
  conv, isActive, onSelect, onDelete, isDark, textPrimary, textMuted,
}: {
  conv: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (id: number) => void;
  isDark: boolean;
  textPrimary: string;
  textMuted: string;
}) => (
  <motion.div
    layout
    className={`sidebar-item group relative flex items-center gap-2 px-2 py-2.5 rounded-xl mb-0.5 cursor-pointer transition-all duration-200 ${
      isActive
        ? isDark
          ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/15'
          : 'bg-purple-50 border border-purple-200'
        : isDark
          ? 'hover:bg-white/[0.04] border border-transparent'
          : 'hover:bg-purple-50/60 border border-transparent'
    }`}
    onClick={onSelect}
    whileHover={{ x: 2 }}
    transition={{ duration: 0.15 }}
  >
    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-cyan-400' : textMuted}`} />
    <span className={`flex-1 text-xs truncate ${isActive ? (isDark ? 'text-cyan-300' : 'text-purple-700') : textPrimary}`}>
      {conv.title}
    </span>
    <button
      onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
      className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-md hover:text-rose-400 ${textMuted}`}
    >
      <Trash2 className="w-3 h-3" />
    </button>
  </motion.div>
);
