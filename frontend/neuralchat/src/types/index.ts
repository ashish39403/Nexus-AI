export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  preview?: string;
}

export interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
}

export interface ChatState {
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: number | null;
  isLoading: boolean;
  isTyping: boolean;
}

export type Theme = 'dark' | 'light';
