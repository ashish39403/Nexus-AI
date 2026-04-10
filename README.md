# 🚀 Nexus AI — Smart Chatbot App

# App Link :- https://nexus-ai-mauve.vercel.app

Nexus AI is a modern AI-powered chatbot web application built using Django and React.  
It provides intelligent conversations with memory, authentication, and a futuristic UI.

---

## ✨ Features

- 🤖 AI Chatbot with context-aware responses  
- 🔐 JWT Authentication (Login & Register)  
- 💬 Conversation Memory (chat history stored)  
- ⚡ Fast backend using Django REST Framework  
- 🎨 Modern futuristic UI (React + animations)  
- 🌐 Fully deployable (Backend + Frontend)  

---

## 🛠️ Tech Stack

### Backend
- Django  
- Django REST Framework  
- JWT Authentication  
- SQLite / PostgreSQL  
- AI Integration (OpenAI / HuggingFace)  

### Frontend
- React (Vite)  
- Axios  
- Tailwind CSS / Custom CSS  
- Framer Motion  

---

## 📁 Project Structure

Nexus-AI/
│
├── backend/
│   ├── accounts/
│   ├── chat/
│   ├── ai_engine/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── package.json
│
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/nexus-ai.git
cd nexus-ai

cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

SECRET_KEY=your_secret_key
DEBUG=True
OPENAI_API_KEY=your_api_key

python manage.py makemigrations
python manage.py migrate
python manage.py runserver

cd frontend

npm install
npm run dev

pip install -r requirements.txt
gunicorn project_name.wsgi

🧠 Future Improvements
Voice Chat 🎤
Image Generation 🎨
File Upload + AI Analysis 📂
Multi-model AI support
Real-time chat using WebSockets

💡 Author

Ashish
Building futuristic AI apps 🚀
