from fastapi import APIRouter, Depends
from app.models.schemas import UsageStatusResponse
from app.routers.auth import get_current_user
from app.services.firebase_service import firebase_service
from app.config import settings

router = APIRouter()


@router.get("/status", response_model=UsageStatusResponse)
async def get_usage_status(
    user: dict = Depends(get_current_user),
):
    """Get user's usage status"""
    user_id = user["uid"]
    
    user_data = await firebase_service.get_user(user_id)
    
    if not user_data:
        # New user defaults
        is_premium = False
        daily_usage = 0
    else:
        is_premium = user_data.get("isPremium", False)
        daily_usage = user_data.get("dailyUsage", 0)
    
    daily_limit = settings.premium_daily_limit if is_premium else settings.free_daily_limit
    remaining = max(0, daily_limit - daily_usage)
    
    return UsageStatusResponse(
        daily_usage=daily_usage,
        daily_limit=daily_limit,
        is_premium=is_premium,
        remaining_messages=remaining,
    )
