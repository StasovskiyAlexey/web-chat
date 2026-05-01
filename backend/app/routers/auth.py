from fastapi import APIRouter, Depends, Request
from ..schemas.response import SuccessResponse
from ..schemas.user import UserCreate, UserLogin, UserResponse
from ..models.user import User
from ..dependencies.auth import get_user_by_refresh_token
from fastapi.responses import Response
from ..core.exceptions import AppError
from ..services.user import UserService
from ..core.auth import create_refresh_token, create_access_token, decode_token, get_token
from ..dependencies.services import get_user_service

router = APIRouter(prefix='/api/v1/auth', tags=['Auth'])

@router.post('/refresh')
async def refresh_access_token(
    request: Request,
):
    refresh_token = get_token(request, "refresh_token")

    if not refresh_token:
      raise AppError(401, "Пользователь не имеет доступа к обновлению access токена, так как для него доступ к API заблокирован")

    try:
      payload = decode_token(refresh_token)
      user_id = payload.get("user_id")
      print(user_id, payload)
      
      # Не мешало бы сделать проверку на тип токена
      # if payload.get("scope") != "refresh_token":
      #   raise AppError(401, "Невалідний тип токена")
    except Exception:
      raise AppError(401, "Токен невалідний")

    new_access_token = create_access_token(user_id) # type: ignore
    
    return {"access_token": new_access_token}

# @router.post('/create_access_token', response_model=SuccessResponse[str], description='Уникальный токен созданный для юзера, который имеет доступ к API, на продакшене, это выглядит примерно следующим образом, мы генерируем такой токен лишь один раз, его длительность в моем случае на месяц, но в проде я бы выдавал на полгода или год, то-есть только имея этот токен, можно пользоваться API')
# async def create_token(user_id: str):
#   token = create_access_token(user_id)
#   return SuccessResponse(
#     data=token,
#     message='Уникальный токен для пользователя успешно создан'
#   )

@router.post('/register_user', response_model=SuccessResponse[UserResponse])
async def register_user(user_data: UserCreate, response: Response, service: UserService = Depends(get_user_service)):
  user = User(login=user_data.login, email=user_data.email, password=user_data.password)
  new_user = await service.create_user(user)
  refresh_token = create_refresh_token(new_user.id)
  
  response.set_cookie(
    key="refresh_token",
    value=refresh_token,
    httponly=True,
    max_age=86400,
    samesite="lax",
    secure=False
  )
  
  return SuccessResponse(
    data=new_user,
    message='Пользователь зарегистрирован',
  )

@router.post('/login_user', response_model=SuccessResponse[UserResponse])
async def login_user(user_data: UserLogin, response: Response, service: UserService = Depends(get_user_service)):
  user = User(login=user_data.login, password=user_data.password)
  exist_user = await service.login_user(user)
  refresh_token = create_refresh_token(exist_user.id)

  response.set_cookie(
    key="refresh_token",
    value=refresh_token,
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
async def check_user(user: User = Depends(get_user_by_refresh_token)):
  return SuccessResponse(
    data=user,
    message='Пользователь залогинен'
  )
  
@router.get('/logout', response_model=SuccessResponse[UserResponse])
async def logout(response: Response, user: User = Depends(get_user_by_refresh_token)):
  if user is None:
    raise AppError(400, 'Пользователь не зарегистрирован')
  
  response.delete_cookie(
    key="refresh_token",
    httponly=True,
    samesite="lax",
    secure=False
  )
  
  return SuccessResponse(
    data=user,
    message='Пользователь залогинен'
  )