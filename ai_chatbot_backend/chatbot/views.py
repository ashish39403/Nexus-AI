from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import ChatRequestSerializer, ChatResponseSerializer
from .services import chatbot_services

class MultiBotChatAPIView(APIView):
    """
    Universal chat endpoint that works with ANY bot type
    Just pass 'bot_type' in request
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.validated_data['message']
            bot_type = serializer.validated_data.get('bot_type', 'general')
            conversation_id = serializer.validated_data.get('conversation_id')
            
            # Select appropriate bot service
            service = chatbot_services.get(bot_type, chatbot_services['general'])
            
            result = service.get_response(
                user_message=message,
                user=request.user,
                conversation_id=conversation_id
            )
            
            return Response(result, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        bot_type = request.query_params.get('bot_type', 'general')
        service = chatbot_services.get(bot_type, chatbot_services['general'])
        conversations = service.get_user_conversations(request.user)
        return Response(list(conversations), status=status.HTTP_200_OK)

class ConversationDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, conversation_id):
        bot_type = request.query_params.get('bot_type', 'general')
        service = chatbot_services.get(bot_type, chatbot_services['general'])
        messages = service.get_conversation_messages(conversation_id, request.user)
        if messages is None:
            return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(list(messages), status=status.HTTP_200_OK)
    
    def delete(self, request, conversation_id):
        bot_type = request.query_params.get('bot_type', 'general')
        service = chatbot_services.get(bot_type, chatbot_services['general'])
        deleted = service.delete_conversation(conversation_id, request.user)
        if not deleted:
            return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Conversation deleted"}, status=status.HTTP_200_OK)