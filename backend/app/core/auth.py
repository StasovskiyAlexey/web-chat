from ..core.config import settings
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

def hash_password(password: str):
  return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
  return pwd_context.verify(password, hashed_password)

# Для пользователя
def create_refresh_token(user_id: str) -> str:
  payload = {"user_id": user_id, "exp": datetime.now() + timedelta(days=7)}
  return jwt.encode(payload, secret_key, algorithm=ALGORITHM)

# Для API
def create_access_token(user_id: str):
  payload = {"user_id": user_id, "exp": datetime.now() + timedelta(minutes=15)}
  return jwt.encode(payload, secret_key, algorithm=ALGORITHM)

def decode_token(token: str) -> dict[str, Any]:
  try:
    return jwt.decode(token, secret_key, algorithms=[ALGORITHM])
  except JWTError:
    raise HTTPException(400, 'Ошибка при декодировании токена')
  
def get_token(request: Request, token_type: str) -> str:
  token = request.cookies.get(token_type)
  return token # type: ignore