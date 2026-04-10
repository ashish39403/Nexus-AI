from django.urls import path
from .views import MultiBotChatAPIView, ConversationListView, ConversationDetailView

urlpatterns = [
    # Naya message bhejne ke liye (POST request)
    path('chat/', MultiBotChatAPIView.as_view(), name='chat-api'),

    # Saari conversations ki list dekhne ke liye (GET request)
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),

    # Kisi specific chat ke messages dekhne (GET) ya chat delete karne (DELETE) ke liye
    path('conversations/<int:conversation_id>/', ConversationDetailView.as_view(), name='conversation-detail'),
]