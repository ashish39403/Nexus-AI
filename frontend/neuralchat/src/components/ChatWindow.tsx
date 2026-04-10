import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { MessageBubble, TypingIndicator } from './MessageBubble';
import { InputBox } from './InputBox';
import { EmptyState } from './EmptyState';
import { useTheme } from '../context/ThemeContext';
import type { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
  onSend: (msg: string) => void;
}

export const ChatWindow = ({ messages, isTyping, isLoading, onSend }: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-purple-400'}`} />
            </motion.div>
          </div>
        ) : messages.length === 0 ? (
          <EmptyState onQuickSend={onSend} />
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <MessageBubble key={msg.id} message={msg} index={idx} />
              ))}
              {isTyping && <TypingIndicator key="typing" />}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className={`flex-shrink-0 px-4 pb-4 pt-2 ${isDark ? 'border-t border-white/[0.05]' : 'border-t border-purple-100'}`}>
        <div className="max-w-2xl mx-auto">
          <InputBox onSend={onSend} isTyping={isTyping} />
        </div>
      </div>
    </div>
  );
};
