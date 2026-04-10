from django.contrib import admin
from .models import Conversation, Message

class MessageInline(admin.TabularInline):
    model = Message
    extra = 0 
    readonly_fields = ('created_at',)  
    ordering = ('created_at',)
    
 
@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'created_at', 'updated_at')
    list_filter = ('created_at', 'user')
    search_fields = ('title', 'user__username', 'user__email')
    
    readonly_fields = ('created_at', 'updated_at')
    
    
    inlines = [MessageInline]

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'role', 'short_content', 'created_at')
    
    list_filter = ('role', 'created_at')
    search_fields = ('content', 'conversation__title')
    readonly_fields = ('created_at',)

   
    def short_content(self, obj):
        if len(obj.content) > 50:
            return f"{obj.content[:50]}..."
        return obj.content
    
    short_content.short_description = 'Content'