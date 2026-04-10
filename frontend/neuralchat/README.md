# ⚡ Neural — Futuristic AI Chat App

A premium, portfolio-worthy AI chat frontend built with React + TypeScript + Vite, connected to your Django backend.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

App runs at **http://localhost:5173**  
Backend must run at **http://localhost:8000**

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AuthPage.tsx       # Login/Register with glassmorphism
│   ├── ChatWindow.tsx     # Main chat area
│   ├── CursorGlow.tsx     # Cursor tracking glow effect
│   ├── EmptyState.tsx     # Futuristic empty state with prompts
│   ├── InputBox.tsx       # Animated input with glow border
│   ├── MessageBubble.tsx  # User/AI bubbles + typing indicator
│   ├── Sidebar.tsx        # Collapsible chat history sidebar
│   └── Topbar.tsx         # Header with theme toggle
├── context/
│   ├── AuthContext.tsx    # JWT auth state management
│   └── ThemeContext.tsx   # Dark/Light theme
├── hooks/
│   └── useChat.ts         # Chat logic, API calls, state
├── services/
│   └── api.ts             # Axios client + auto token refresh
└── types/
    └── index.ts           # TypeScript interfaces
```

## 🎨 Design System

- **Font**: Sora (body) · Orbitron (display) · JetBrains Mono (code)
- **Dark bg**: Deep navy gradient (#060818 → #0b0f24)
- **Light bg**: Soft lavender gradient
- **Primary**: Cyan #00d4ff · Purple #7c3aed · Pink #ec4899
- **Effects**: Glassmorphism, cursor glow, animated orbs, CSS grid overlay

## ✨ Features

- 🔐 JWT Auth (Login/Register) with auto token refresh
- 💬 Real-time chat with your Django AI backend
- 📜 Conversation history with sidebar
- 🌙 Dark/Light futuristic theme toggle
- ⌨️ Typing indicator with animated dots
- 📋 Copy message button on hover
- 🎯 Quick prompt suggestions
- 🖱️ Cursor glow tracking effect
- ✨ Framer Motion animations throughout
- 📱 Responsive layout

## 🔌 API Endpoints Used

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/login/` | POST | Sign in |
| `/api/auth/register/` | POST | Sign up |
| `/api/auth/profile/` | GET | Get user info |
| `/api/auth/logout/` | POST | Sign out |
| `/api/chatbot/chat/` | POST | Send message |
| `/api/chatbot/conversations/` | GET | List conversations |
| `/api/chatbot/conversations/:id/` | GET/DELETE | Load/Delete |

## 🛠️ Tech Stack

- React 18 + TypeScript + Vite
- TailwindCSS v3
- Framer Motion
- Lucide React (icons)
- Axios (HTTP + interceptors)
