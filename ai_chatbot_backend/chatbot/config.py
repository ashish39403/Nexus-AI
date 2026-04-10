MODEL_CONFIG = {
    'general': {
        'provider': 'openai',  # 'openai' or 'anthropic'
        'model': 'gpt-4o-mini',
        'temperature': 0.6,
        'max_tokens': 1000,
        'context_length': 20,  # Number of previous messages to keep
    }}