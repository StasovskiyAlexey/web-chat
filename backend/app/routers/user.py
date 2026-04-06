import email

from fastapi import APIRouter, Depends
from ..schemas.user import UserResponse, UserUpdate
from ..schemas.response import SuccessResponse
from ..models.user import User

from ..services.user import UserService
from ..dependencies.auth import get_current_user, get_service

router = APIRouter(prefix='/api/v1/users', tags=['Users'])

@router.post('/get_user_by_email', response_model=SuccessResponse[UserResponse])
async def get_user_by_email(email: str, service: UserService = Depends(get_service)):
  user = await service.get_user_by_email(email)
  return SuccessResponse(
    data=user
  )

@router.post('/get_user_by_id', response_model=SuccessResponse[UserResponse])
async def get_user_by_id(id: str, service: UserService = Depends(get_service)):
  user = await service.get_user_by_id(id)
  return SuccessResponse(
    data=user
  )

@router.patch('/update_user', response_model=SuccessResponse[UserResponse])
async def update_user(user_data: UserUpdate, user: User = Depends(get_current_user), service: UserService = Depends(get_service)):
  updated_user = await service.update_user(user.id, login=user_data.login, email=user_data.email, password=user_data.password)
  return SuccessResponse(
    data=updated_user,
    message='Пользователь был успешно обновлен'
  )