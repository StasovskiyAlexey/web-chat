from typing import Annotated, Optional
from attr import has
from fastapi import APIRouter, Body, Depends
from app.core.auth import get_google_auth_url, get_github_auth_url
from ..schemas.response import SuccessResponse
from ..schemas.user import UserCreate, UserLogin, UserResponse
from ..models.user import User
from ..dependencies.auth import get_current_user, get_current_user_optional, get_service

import httpx
from jose import jwt
from ..core.auth import create_token, create_token_by_id, get_discord_auth_url

from fastapi.responses import Response
from ..core.config import settings
from ..core.exceptions import AppError
from ..services.user import UserService

router = APIRouter(prefix='/api/v1/auth', tags=['Auth'])

@router.post('/register_user', response_model=SuccessResponse[UserResponse])
async def register_user(user_data: UserCreate, response: Response, service: UserService = Depends(get_service)):
  user = User(login=user_data.login, email=user_data.email, password=user_data.password)
  new_user = await service.create_user(user)
  token = create_token_by_id(new_user.id)
  
  response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    max_age=86400,
    samesite="lax",
    secure=False
  )
  
  return SuccessResponse(
    data=new_user,
    message='Пользователь зарегистрирован'
  )

@router.post('/login_user', response_model=SuccessResponse[UserResponse])
async def login_user(user_data: UserLogin, response: Response, service: UserService = Depends(get_service)):
  user = User(login=user_data.login, password=user_data.password)
  exist_user = await service.login_user(user)
  token = create_token_by_id(exist_user.id)

  response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    max_age=86400,
    samesite="lax",
    secure=False
  )
  
  return SuccessResponse(
    data=exist_user,
    message='Успешный вход в аккаунт'
  )

@router.get('/check_user', response_model=SuccessResponse[UserResponse])
async def check_user(user: User = Depends(get_current_user)):
  return SuccessResponse(
    data=user,
    message='Пользователь залогинен'
  )
  
@router.get('/logout', response_model=SuccessResponse[UserResponse])
async def logout(response: Response, user: User = Depends(get_current_user)):
  if user is None:
    raise AppError(400, 'Пользователь не зарегистрирован')
  
  response.delete_cookie(
    key="access_token",
    httponly=True,
    samesite="lax",
    secure=False
  )
  
  return SuccessResponse(
    data=user,
    message='Пользователь залогинен'
  )

# Прогуглить и попробовать поиспользовать различные библиотеки python встроенные и другие для работы с бекендом
# Сделать через контекст проверку юзера