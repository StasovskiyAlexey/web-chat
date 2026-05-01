from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from ..core.exceptions import AppError
from ..core.auth import decode_token, get_token
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.db import get_db
from ..models import User
from ..core.auth import decode_token

bearer_scheme = HTTPBearer()

# async def get_user_by_token(request: Request):
#   token = request.cookies.get('refresh_token')
  
#   try:
#     payload = decode_token(token)
#     user_id = payload.get('user_id')

#     if user_id is 
  
# Функция зависимость для получения юзера через токен
async def get_user_by_refresh_token(request: Request, auth: HTTPAuthorizationCredentials = Depends(bearer_scheme), db: AsyncSession = Depends(get_db)):
  token: str = request.cookies.get('refresh_token') # type: ignore
  
  try:
    payload = decode_token(token)
    print('payload', payload)
    user_id = payload.get('user_id')
    
    if user_id is None:
      raise AppError(400, f'Пользователь с ID {user_id} не найден')
    
  except Exception as e:
    raise AppError(400, f'{e}')
  
  result = await db.execute(select(User).where(User.id == user_id))
  user = result.scalar_one_or_none()
  
  if not user:
    raise AppError(400, 'Пользователь не найден в БД')
  
  return user

# Функция для получения юзера по bearer токену(проверка для того чтобы юзать API)
async def get_user_by_access_token(request: Request, credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), db: AsyncSession = Depends(get_db)):
  token = get_token(request, 'access_token')
  print('credentials', credentials)
  if not token:
    raise AppError(400, 'Пользователь не авторизован')
  
  payload = decode_token(token)
  user_id = payload.get('user_id')
  
  if not user_id:
    raise AppError(400, f'Пользователь с ID {user_id} не найден')
  
  result = await db.execute(select(User).where(User.id == user_id))
  user = result.scalar_one_or_none()
  
  if not user:
    raise AppError(400, 'Пользователь не найден в БД')

  return user

# Возможно стоит потом сделать это в одну функцию и удобно юзать с разными параметрами