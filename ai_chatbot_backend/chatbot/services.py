import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage , AIMessage , SystemMessage
from typing import List , Dict , Any ,Optional
from django.contrib.auth.models import User
from .prompts import get_system_prompt
from .config import MODEL_CONFIG
from .models import Conversation , Message

load_dotenv()

class ChatBotService:
    
    def __init__(self , bot_type ="general"):
        self.bot_type = bot_type
        self.config = MODEL_CONFIG.get(bot_type , MODEL_CONFIG['general'])
        
    # Initializing the llm based on the configuration
        if self.config['provider'] =='openai':
            self.llm = ChatOpenAI(
                model = self.config['model'],
                temperature = self.config['temperature'],
                api_key = os.getenv("AICREDITS_API_KEY"),
                base_url="https://api.aicredits.in/v1",
                max_tokens = self.config.get('max_tokens' ,1000),
                
            )
        else:
            raise ValueError("LLM not provided")
        
    def get_conversation_history(self, conversation_id: int, user: User) -> tuple:
        """Load conversation from database"""
        try:
            conversation = Conversation.objects.get(id=conversation_id, user=user)
            messages = [SystemMessage(content=get_system_prompt(self.bot_type))]
            db_messages = Message.objects.filter(
                conversation=conversation
            ).order_by('created_at')[:self.config['context_length']]
            
            for msg in db_messages:
                if msg.role == 'user':
                    messages.append(HumanMessage(content=msg.content))
                else:
                    messages.append(AIMessage(content=msg.content))
            
            return messages, conversation
        except Conversation.DoesNotExist:
            return None, None
    
    
    def save_message(self, conversation: Conversation, role: str, content: str) -> Message:
        """Save message to database"""
        return Message.objects.create(
            conversation=conversation,
            role=role,
            content=content
        )
    
    
    def create_conversation(self, user: User, title: str = "New Chat") -> Conversation:
        """Create new conversation"""
        return Conversation.objects.create(user=user, title=title)
    
    def get_response(
        self, 
        user_message: str, 
        user: User, 
        conversation_id: Optional[int] = None,
        additional_context: Optional[Dict] = None
    ) -> Dict:
        """
        Main method - Get AI response
        
        additional_context can contain:
        - documents: For RAG (Retrieval Augmented Generation)
        - user_context: User preferences, history
        - metadata: Any extra info for the LLM
        """
        
        # Get or create conversation
        if not conversation_id:
            conversation = self.create_conversation(user)
            messages = [SystemMessage(content=get_system_prompt(self.bot_type))]
        else:
            messages, conversation = self.get_conversation_history(conversation_id, user)
            if not conversation:
                conversation = self.create_conversation(user)
                messages = [SystemMessage(content=get_system_prompt(self.bot_type))]
     
        self.save_message(conversation, 'user', user_message)
        
  
        messages.append(HumanMessage(content=user_message))
        
      
        if additional_context:
            context_message = f"\n\nAdditional Context: {additional_context}"
            messages[-1].content += context_message
        
        # Get AI response
        try:
            response = self.llm.invoke(messages)
            response_text = response.content
        except Exception as e:
            response_text = f"I'm experiencing technical difficulties. Error: {str(e)}"
        
        # Save AI response
        self.save_message(conversation, 'assistant', response_text)
        
        # Update conversation title if it's the first message
        if Message.objects.filter(conversation=conversation).count() == 2:
            # Generate title from first user message
            new_title = user_message[:50] + ("..." if len(user_message) > 50 else "")
            conversation.title = new_title
            conversation.save()
        
        return {
            'response': response_text,
            'conversation_id': conversation.id,
            'conversation_title': conversation.title,
            'bot_type': self.bot_type
        }
    
    def get_user_conversations(self, user: User) -> List[Dict]:
        """Get all conversations for a user"""
        return Conversation.objects.filter(user=user).values(
            'id', 'title', 'created_at', 'updated_at'
        ).order_by('-updated_at')
    
    def get_conversation_messages(self, conversation_id: int, user: User) -> Optional[List[Dict]]:
        """Get all messages in a conversation"""
        try:
            conversation = Conversation.objects.get(id=conversation_id, user=user)
            return Message.objects.filter(conversation=conversation).values(
                'id', 'role', 'content', 'created_at'
            ).order_by('created_at')
        except Conversation.DoesNotExist:
            return None
    
    def delete_conversation(self, conversation_id: int, user: User) -> bool:
        """Delete a conversation"""
        try:
            conversation = Conversation.objects.get(id=conversation_id, user=user)
            conversation.delete()
            return True
        except Conversation.DoesNotExist:
            return False

        
        

# ✅ Sahi code (Dictionary banani hai)
chatbot_services = {
    'general': ChatBotService(bot_type='general')
}