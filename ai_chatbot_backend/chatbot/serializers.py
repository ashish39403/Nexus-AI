from rest_framework import serializers

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=2000)
    bot_type = serializers.ChoiceField(
        choices=['general'],
        default='general'
    )
    conversation_id = serializers.IntegerField(required=False, allow_null=True)
    additional_context = serializers.DictField(required=False, allow_null=True)

class ChatResponseSerializer(serializers.Serializer):
    response = serializers.CharField()
    conversation_id = serializers.IntegerField()
    conversation_title = serializers.CharField()
    bot_type = serializers.CharField()