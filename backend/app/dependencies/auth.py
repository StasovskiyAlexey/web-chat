from fastapi import Depends, Request
from ..core.exceptions import AppError

from ..core.db import get_db
from ..repository.user import UserRepository

from ..core.auth import decode_token, get_token
from sqlalchemy.ext.asyncio import AsyncSession
from ..services.user import UserService

def get_service(db: AsyncSession = Depends(get_db)):
  return UserService(UserRepository(db))

async def get_current_user(request: Request, service: UserService = Depends(get_service)):
  token = get_token(request)
  
  if not token:
    raise AppError(400, 'Пользователь не авторизован')
  
  decoded_token = decode_token(token)
  user = await service.get_user_by_id(decoded_token['sub'])
  
  if not user:
    raise AppError(400, 'Пользователь не найден')

  return user

# Чтобы функция не падала когда юзера нет, используем try except для создания защиты
async def get_current_user_optional(request: Request, service: UserService = Depends(get_service)):
  try:
    return await get_current_user(request, service)
  except:
    return None