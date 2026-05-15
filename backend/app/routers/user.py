from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from ..schemas.user import UserResponse, UserUpdate
from ..schemas.response import SuccessResponse
from ..models.user import User

from ..services import UserService
from ..dependencies.auth import get_user_by_refresh_token, get_user_by_access_token
from ..dependencies.services import get_user_service

router = APIRouter(prefix='/api/v1/users', tags=['Users'])

@router.post('/get_user_by_token', response_model=SuccessResponse[UserResponse], description='Получение юзера по refresh токену')
async def get_user(user: User = Depends(get_user_by_refresh_token)):
  return SuccessResponse(
    data=user
  )

@router.patch('/update_user', response_model=SuccessResponse[UserResponse], description='Обновление данных пользователя')
async def update_user(user_data: UserUpdate, is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token), user: User = Depends(get_user_by_refresh_token), service: UserService = Depends(get_user_service)):
  updated_user = await service.update_user(user.id, login=user_data.login, email=user_data.email, password=user_data.password, new_password=user_data.new_password)
  return SuccessResponse(
    data=updated_user,
    message='Пользователь был успешно обновлен'
  )