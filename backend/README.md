# ChatMate Backend

FastAPI backend for ChatMate AI companion mobile app.

## Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start development server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

## Endpoints

- `POST /auth/verify` - Verify Firebase token
- `POST /chat/message` - Send message and get AI response
- `GET /chat/history` - Get user's chat history
- `GET /usage/status` - Get usage status and limits
- `GET /health` - Health check

## Environment Variables

See `.env.example` for required configuration.
