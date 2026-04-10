import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useChat } from './hooks/useChat';
import { AuthPage } from './components/AuthPage';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { Topbar } from './components/Topbar';
import { CursorGlow } from './components/CursorGlow';

const ChatApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark } = useTheme();
  const {
    messages, conversations, currentConversationId,
    isTyping, isLoading,
    sendMessage, startNewChat, loadConversation,
    fetchConversations, deleteConversation,
  } = useChat();

  const currentConvTitle = conversations.find(c => c.id === currentConversationId)?.title;

  const handleNewChat = () => {
    startNewChat();
  };

  return (
    <div className={`w-full h-full flex relative overflow-hidden ${isDark ? 'animated-bg-dark' : 'animated-bg-light'}`}>
      {/* Grid overlay */}
      <div className={`absolute inset-0 pointer-events-none ${isDark ? 'grid-overlay' : 'grid-overlay-light'}`} />

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl orb-pulse"
          style={{ background: isDark ? 'rgba(0,212,255,0.04)' : 'rgba(124,58,237,0.08)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl orb-pulse"
          style={{ background: isDark ? 'rgba(124,58,237,0.05)' : 'rgba(0,212,255,0.06)', animationDelay: '2s' }}
        />
      </div>

      {/* Cursor glow */}
      <CursorGlow />

      {/* Sidebar */}
      <div className="relative z-20 flex-shrink-0">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          conversations={conversations}
          currentId={currentConversationId}
          onNewChat={handleNewChat}
          onSelectChat={loadConversation}
          onDeleteChat={deleteConversation}
          onFetchConversations={fetchConversations}
        />
      </div>

      {/* Main content */}
      <motion.main
        className="flex-1 flex flex-col min-w-0 relative z-10"
        animate={{ marginLeft: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Topbar
          conversationTitle={currentConvTitle}
          sidebarOpen={sidebarOpen}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentConversationId ?? 'new'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-h-0 flex flex-col"
          >
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              isLoading={isLoading}
              onSend={sendMessage}
            />
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

function App() {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className={`w-full h-full ${isDark ? 'dark' : ''}`}>
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <ChatApp />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <AuthPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
