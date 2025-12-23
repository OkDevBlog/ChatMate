from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime


# Auth models
class TokenVerifyRequest(BaseModel):
    """Request to verify Firebase token"""
    pass  # Token comes from Authorization header


class TokenVerifyResponse(BaseModel):
    """Response from token verification"""
    valid: bool
    user_id: str


# Chat models
class SendMessageRequest(BaseModel):
    """Request to send a message"""
    chat_id: Optional[str] = None
    content: str = Field(..., min_length=1, max_length=4000)
    tone: Literal["friendly", "professional", "tutor"] = "friendly"


class SendMessageResponse(BaseModel):
    """Response from sending a message"""
    message_id: str
    chat_id: str
    content: str
    timestamp: str


class ChatMessage(BaseModel):
    """A single chat message"""
    message_id: str
    chat_id: str
    sender: Literal["user", "ai"]
    content: str
    timestamp: datetime


class Chat(BaseModel):
    """A chat conversation"""
    chat_id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime


class ChatHistoryResponse(BaseModel):
    """Response containing chat history"""
    chats: List[Chat]
    total: int


# Usage models
class UsageStatusResponse(BaseModel):
    """Response for usage status"""
    daily_usage: int
    daily_limit: int
    is_premium: bool
    remaining_messages: int


# User model
class User(BaseModel):
    """User data from Firestore"""
    uid: str
    email: Optional[str]
    is_premium: bool = False
    daily_usage: int = 0
    selected_tone: Literal["friendly", "professional", "tutor"] = "friendly"
