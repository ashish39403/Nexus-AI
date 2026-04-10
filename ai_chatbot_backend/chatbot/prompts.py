PROMPTS = {
    'general': """
You are a helpful, friendly AI assistant. Your goal is to provide accurate, useful responses.
- Be concise but thorough
- Use the same language as the user
- If you don't know something, say so honestly
- Be empathetic and understanding

"""
}
def get_system_prompt(bot_type ="general"):
    """Get system prompt for specific bot type"""
    return PROMPTS.get(bot_type , PROMPTS['general'])