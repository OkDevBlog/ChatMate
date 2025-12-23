from fastapi import HTTPException, status
from app.services.firebase_service import firebase_service
from app.config import settings


async def check_rate_limit(user_id: str) -> bool:
    """
    Check if user has exceeded their daily message limit.
    Raises HTTPException if limit exceeded.
    """
    user_data = await firebase_service.get_user(user_id)
    
    if not user_data:
        # New user, allow the request
        return True
    
    is_premium = user_data.get("isPremium", False)
    daily_usage = user_data.get("dailyUsage", 0)
    
    # Get limit based on user type
    limit = settings.premium_daily_limit if is_premium else settings.free_daily_limit
    
    if daily_usage >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "rate_limit_exceeded",
                "message": f"Daily message limit ({limit}) reached. {'Upgrade to premium for more messages!' if not is_premium else 'Please try again tomorrow.'}",
                "limit": limit,
                "usage": daily_usage,
                "is_premium": is_premium,
            }
        )
    
    return True


class RateLimitMiddleware:
    """
    Alternative middleware implementation for rate limiting.
    Can be used with Redis for distributed rate limiting.
    """
    
    def __init__(self, redis_url: str = None):
        self.redis = None
        if redis_url:
            try:
                import redis
                self.redis = redis.from_url(redis_url)
            except ImportError:
                print("Redis not installed, using Firestore for rate limiting")
    
    async def check_limit(self, user_id: str, limit: int) -> tuple[bool, int]:
        """
        Check rate limit using Redis if available, otherwise Firestore.
        Returns (is_allowed, current_count)
        """
        if self.redis:
            return await self._check_redis_limit(user_id, limit)
        return await self._check_firestore_limit(user_id, limit)
    
    async def _check_redis_limit(self, user_id: str, limit: int) -> tuple[bool, int]:
        """Check limit using Redis with sliding window"""
        import time
        
        key = f"rate_limit:{user_id}:{time.strftime('%Y-%m-%d')}"
        
        pipe = self.redis.pipeline()
        pipe.incr(key)
        pipe.expire(key, 86400)  # Expire after 24 hours
        results = pipe.execute()
        
        current = results[0]
        return current <= limit, current
    
    async def _check_firestore_limit(self, user_id: str, limit: int) -> tuple[bool, int]:
        """Check limit using Firestore"""
        user_data = await firebase_service.get_user(user_id)
        current = user_data.get("dailyUsage", 0) if user_data else 0
        return current < limit, current
