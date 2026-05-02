from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from ..core.exceptions import AppError
from ..core.auth import decode_token
from ..core.auth import decode_token
from ..dependencies.services import get_user_service
from .services import UserService

bearer_scheme = HTTPBearer()

# Функция зависимость для получения юзера через токен, без проверки bearer
async def get_user_by_refresh_token(request: Request, service: UserService = Depends(get_user_service)):
  token: str = request.cookies.get('refresh_token') # type: ignore
  
  if not token:
    raise AppError(400, 'Токен не найден')
  
  try:
    payload = decode_token(token)
    user_id = payload.get('user_id')
    
    if user_id is None:
      raise AppError(400, f'Пользователь с ID {user_id} не найден')
    
  except Exception as e:
    raise AppError(400, f'{e}')

  user = await service.get_user_by_id(user_id)
  
  if not user:
    raise AppError(400, 'Пользователь не найден в БД')
  
  return user

# Функция для получения юзера по bearer токену(проверка для того чтобы юзать API)
async def get_user_by_access_token(service: UserService = Depends(get_user_service), credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
  token = credentials.credentials

  if not token:
    raise AppError(401, 'Bearer токен не найден')
  
  payload = decode_token(token)
  user_id = payload.get('user_id')
  
  if not user_id:
    raise AppError(401, f'Пользователь с ID {user_id} не найден')

  user = await service.get_user_by_id(user_id)
  
  if not user:
    raise AppError(401, 'Пользователь не найден в БД')

  return user

# Возможно стоит потом сделать это в одну функцию и удобно юзать с разными параметрами