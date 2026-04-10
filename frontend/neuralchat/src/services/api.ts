import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access');
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh });
        localStorage.setItem('access', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email: string, full_name: string, password: string, confirm_password: string) =>
    api.post('/auth/register/', { email, full_name, password, confirm_password }),

  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),

  profile: () => api.get('/auth/profile/'),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),
};

export const chatAPI = {
  sendMessage: (message: string, conversation_id?: number | null) =>
    api.post('/chatbot/chat/', {
      message,
      bot_type: 'general',
      conversation_id: conversation_id ?? null,
    }),

  getConversations: () => api.get('/chatbot/conversations/'),

  getConversationMessages: (id: number) =>
    api.get(`/chatbot/conversations/${id}/`),

  deleteConversation: (id: number) =>
    api.delete(`/chatbot/conversations/${id}/`),
};

export default api;
