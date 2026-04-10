import { useState, useCallback } from 'react';

import type { Message, Conversation } from '../types';
import { chatAPI } from '../services/api';

// Simple uuid fallback
const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const { data } = await chatAPI.getConversations();
      setConversations(
        data.map((c: any) => ({
          id: c.id,
          title: c.title,
          created_at: c.created_at,
          updated_at: c.updated_at,
        }))
      );
    } catch {
      // ignore
    }
  }, []);

  const loadConversation = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const { data } = await chatAPI.getConversationMessages(id);
      const msgs: Message[] = data.map((m: any) => ({
        id: genId(),
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
        timestamp: new Date(m.created_at),
      }));
      setMessages(msgs);
      setCurrentConversationId(id);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: genId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const { data } = await chatAPI.sendMessage(content, currentConversationId);

      const aiMsg: Message = {
        id: genId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (!currentConversationId) {
        setCurrentConversationId(data.conversation_id);
        // Refresh conversation list
        await fetchConversations();
      } else {
        // Update title if needed
        setConversations((prev) =>
          prev.map((c) =>
            c.id === data.conversation_id ? { ...c, title: data.conversation_title } : c
          )
        );
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: genId(),
        role: 'assistant',
        content: '⚠️ Connection error. Please check if the backend server is running.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [currentConversationId, fetchConversations]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
  }, []);

  const deleteConversation = useCallback(async (id: number) => {
    try {
      await chatAPI.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (currentConversationId === id) {
        setMessages([]);
        setCurrentConversationId(null);
      }
    } catch {
      // ignore
    }
  }, [currentConversationId]);

  return {
    messages,
    conversations,
    currentConversationId,
    isTyping,
    isLoading,
    sendMessage,
    startNewChat,
    loadConversation,
    fetchConversations,
    deleteConversation,
  };
};
