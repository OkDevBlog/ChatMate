import firebase_admin
from firebase_admin import credentials, auth, firestore
from typing import Optional, Dict, List
from app.config import settings
from datetime import datetime


class FirebaseService:
    def __init__(self):
        self._initialized = False
        self._db = None
    
    def _initialize(self):
        """Initialize Firebase Admin SDK"""
        if self._initialized:
            return
        
        try:
            # Check if already initialized
            firebase_admin.get_app()
        except ValueError:
            # Initialize with credentials
            if settings.firebase_private_key:
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": settings.firebase_project_id,
                    "private_key": settings.firebase_private_key.replace("\\n", "\n"),
                    "client_email": settings.firebase_client_email,
                    "token_uri": "https://oauth2.googleapis.com/token",
                })
                firebase_admin.initialize_app(cred)
            else:
                # Use default credentials (for local development)
                firebase_admin.initialize_app()
        
        self._db = firestore.client()
        self._initialized = True
    
    @property
    def db(self):
        if not self._initialized:
            self._initialize()
        return self._db
    
    async def verify_token(self, token: str) -> Optional[Dict]:
        """Verify Firebase ID token"""
        self._initialize()
        try:
            decoded = auth.verify_id_token(token)
            return {"uid": decoded["uid"], "email": decoded.get("email")}
        except Exception as e:
            print(f"Token verification failed: {e}")
            return None
    
    async def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user data from Firestore"""
        try:
            doc = self.db.collection("users").document(user_id).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Error fetching user: {e}")
            return None
    
    async def update_user(self, user_id: str, data: Dict) -> bool:
        """Update user data in Firestore"""
        try:
            self.db.collection("users").document(user_id).update(data)
            return True
        except Exception as e:
            print(f"Error updating user: {e}")
            return False
    
    async def increment_usage(self, user_id: str) -> bool:
        """Increment daily usage count"""
        try:
            user_ref = self.db.collection("users").document(user_id)
            user_ref.update({"dailyUsage": firestore.Increment(1)})
            return True
        except Exception as e:
            print(f"Error incrementing usage: {e}")
            return False
    
    async def get_chats(self, user_id: str, limit: int = 50) -> List[Dict]:
        """Get user's chat history"""
        try:
            docs = (
                self.db.collection("chats")
                .where("userId", "==", user_id)
                .order_by("updatedAt", direction=firestore.Query.DESCENDING)
                .limit(limit)
                .stream()
            )
            
            chats = []
            for doc in docs:
                data = doc.to_dict()
                data["chatId"] = doc.id
                # Convert timestamps
                if data.get("createdAt"):
                    data["createdAt"] = data["createdAt"]
                if data.get("updatedAt"):
                    data["updatedAt"] = data["updatedAt"]
                chats.append(data)
            
            return chats
        except Exception as e:
            print(f"Error fetching chats: {e}")
            return []
    
    async def get_messages(self, chat_id: str, limit: int = 50) -> List[Dict]:
        """Get messages for a chat"""
        try:
            docs = (
                self.db.collection("messages")
                .where("chatId", "==", chat_id)
                .order_by("timestamp")
                .limit(limit)
                .stream()
            )
            
            messages = []
            for doc in docs:
                data = doc.to_dict()
                data["messageId"] = doc.id
                messages.append(data)
            
            return messages
        except Exception as e:
            print(f"Error fetching messages: {e}")
            return []
    
    async def reset_daily_usage(self) -> int:
        """Reset daily usage for all users (run via cron job)"""
        try:
            batch = self.db.batch()
            users = self.db.collection("users").stream()
            
            count = 0
            for user in users:
                batch.update(user.reference, {"dailyUsage": 0})
                count += 1
            
            batch.commit()
            return count
        except Exception as e:
            print(f"Error resetting usage: {e}")
            return 0


firebase_service = FirebaseService()
