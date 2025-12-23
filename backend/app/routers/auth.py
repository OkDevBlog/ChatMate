from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.schemas import TokenVerifyResponse
from app.services.firebase_service import firebase_service

router = APIRouter()
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Get current user from Firebase token"""
    token = credentials.credentials
    user = await firebase_service.verify_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.post("/verify", response_model=TokenVerifyResponse)
async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Verify Firebase authentication token"""
    token = credentials.credentials
    user = await firebase_service.verify_token(token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    
    return TokenVerifyResponse(valid=True, user_id=user["uid"])
