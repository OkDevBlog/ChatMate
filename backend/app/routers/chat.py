from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import (
    SendMessageRequest,
    SendMessageResponse,
    ChatHistoryResponse,
    Chat,
)
from app.routers.auth import get_current_user
from app.services.openai_service import openai_service
from app.services.firebase_service import firebase_service
from app.middleware.rate_limiter import check_rate_limit
from datetime import datetime
import uuid

router = APIRouter()


@router.post("/message", response_model=SendMessageResponse)
async def send_message(
    request: SendMessageRequest,
    user: dict = Depends(get_current_user),
):
    """Send a message and get AI response"""
    user_id = user["uid"]
    
    # Check rate limit
    await check_rate_limit(user_id)
    
    # Get user data for premium status
    user_data = await firebase_service.get_user(user_id)
    is_premium = user_data.get("isPremium", False) if user_data else False
    
    # Generate chat ID if new conversation
    chat_id = request.chat_id or str(uuid.uuid4())
    
    # Get conversation history for context
    history = []
    if request.chat_id:
        history = await firebase_service.get_messages(request.chat_id, limit=10)
    
    # Generate AI response
    ai_response = await openai_service.generate_response(
        user_message=request.content,
        tone=request.tone,
        conversation_history=history,
        is_premium=is_premium,
    )
    
    # Create response
    message_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()
    
    # Increment daily usage
    await firebase_service.increment_usage(user_id)
    
    return SendMessageResponse(
        message_id=message_id,
        chat_id=chat_id,
        content=ai_response,
        timestamp=timestamp,
    )


@router.get("/history", response_model=ChatHistoryResponse)
async def get_chat_history(
    user: dict = Depends(get_current_user),
):
    """Get user's chat history"""
    user_id = user["uid"]
    
    chats = await firebase_service.get_chats(user_id)
    
    return ChatHistoryResponse(
        chats=[
            Chat(
                chat_id=c["chatId"],
                user_id=c["userId"],
                title=c["title"],
                created_at=c["createdAt"],
                updated_at=c["updatedAt"],
            )
            for c in chats
        ],
        total=len(chats),
    )
