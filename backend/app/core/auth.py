from ..core.config import settings
from urllib.parse import urlencode
import jwt
from jose import JWTError
from datetime import datetime, timedelta
from typing import Any, TypeVar
from fastapi import Request, HTTPException
from passlib.context import CryptContext
from jose import JWTError, jwt

T = TypeVar("T")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
secret_key = settings.secret_key

def get_google_auth_url():
  params = {
    "client_id": settings.google_client_id,
    "redirect_uri": settings.google_redirect_url,
    "response_type": 'code',
    "scope": "openid profile email",
    "access_type": 'offline',
  }

  base_url = "https://accounts.google.com/o/oauth2/v2/auth"
  return f"{base_url}?{urlencode(params)}"

def get_github_auth_url():
  params = {
    "client_id": settings.github_client_id,
    "redirect_uri": settings.github_redirect_url,
    "scope": "user:email",
    "allow_signup": "true",
  }

  base_url = "https://github.com/login/oauth/authorize"
  return f"{base_url}?{urlencode(params)}"

def get_discord_auth_url():
  params = {
      "client_id": settings.discord_client_id,
      "redirect_uri": settings.discord_redirect_url,
      "response_type": "code",
      "scope": "identify email"
  }
  
  base_url = "https://discord.com/api/oauth2/authorize"
  return f"{base_url}?{urlencode(params)}"

def hash_password(password: str):
  return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
  return pwd_context.verify(password, hashed_password)

def create_token(email: str) -> str:
  payload = {"sub": email, "exp": datetime.utcnow() + timedelta(hours=24)}
  return jwt.encode(payload, secret_key, algorithm=ALGORITHM)

def create_token_by_id(id: str) -> str:
  payload = {"sub": id, "exp": datetime.utcnow() + timedelta(hours=24)}
  return jwt.encode(payload, secret_key, algorithm=ALGORITHM)

def decode_token(token: str) -> dict[str, Any]:
  try:
    return jwt.decode(token, secret_key, algorithms=[ALGORITHM])
  except JWTError:
    raise HTTPException(400, 'Ошибка при декодировании токена')
  
def get_token(request: Request):
  token = request.cookies.get('access_token')
  return token