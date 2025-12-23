from google import genai
from google.genai import types
from typing import List, Dict, Literal
from app.config import settings
from app.services.prompt_manager import prompt_manager


class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model_id = "gemini-2.0-flash"
    
    async def generate_response(
        self,
        user_message: str,
        tone: Literal["friendly", "professional", "tutor"],
        conversation_history: List[Dict] = None,
        is_premium: bool = False,
    ) -> str:
        """Generate AI response using Google Gemini"""
        
        # Get system prompt for the tone
        system_prompt = prompt_manager.get_system_prompt(tone)
        
        # Build conversation context
        context_parts = [system_prompt + "\n\n"]
        
        # Add conversation history
        if conversation_history:
            for msg in conversation_history[-6:]:  # Last 6 messages
                role = "User" if msg.get("sender") == "user" else "Assistant"
                context_parts.append(f"{role}: {msg.get('content', '')}\n")
        
        # Add current user message
        context_parts.append(f"User: {user_message}\n\nAssistant:")
        
        full_prompt = "".join(context_parts)
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    max_output_tokens=1000 if is_premium else 500,
                    temperature=0.7,
                )
            )
            
            return response.text or "I couldn't generate a response. Please try again."
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            return "I'm having trouble connecting right now. Please try again in a moment."
    
    async def summarize_conversation(
        self,
        messages: List[Dict],
    ) -> str:
        """Summarize a conversation to reduce token usage"""
        
        conversation_text = "\n".join([
            f"{'User' if m['sender'] == 'user' else 'AI'}: {m['content']}"
            for m in messages
        ])
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=f"Summarize this conversation concisely, capturing key points and context:\n\n{conversation_text}",
                config=types.GenerateContentConfig(
                    max_output_tokens=200,
                    temperature=0.5,
                )
            )
            
            return response.text or ""
            
        except Exception as e:
            print(f"Summarization error: {e}")
            return ""


# Export as openai_service for compatibility with existing code
openai_service = GeminiService()
