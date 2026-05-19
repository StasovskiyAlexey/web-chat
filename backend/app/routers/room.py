from typing import List

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from ..schemas.response import SuccessResponse
from ..schemas.room import RoomCreate, RoomResponse, RoomUpdate, RoomResponseWithMessages
from ..dependencies.services import get_room_service, get_user_service
from ..services import RoomService
from ..models import Room, User
from ..dependencies.auth import get_user_by_access_token, get_user_by_refresh_token
from ..schemas.invite import InviteResponse, InviteCreate
from ..schemas.notification import NotificationCreate

router = APIRouter(prefix='/api/v1/rooms', tags=['Rooms'])

@router.get('/get_rooms', response_model=SuccessResponse[List[RoomResponse]], description='Получение всех комнат доступных пользователю')
async def get_rooms(user: User = Depends(get_user_by_refresh_token), service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  rooms = await service.get_rooms(user.id)
  return SuccessResponse(
    data=rooms
  )

@router.post('/get_room_by_id', response_model=SuccessResponse[RoomResponseWithMessages], description='Получение комнаты по ID')
async def get_room_by_id(room_id: str, service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  room = await service.get_room_by_id(room_id)
  return SuccessResponse(
    data=room
  )

@router.post('/create_room', response_model=SuccessResponse[RoomResponse], description='Создание комнаты, тот кто создал получает роль owner, то-есть создатель со своими правами, а при присоединении другого пользователя к комнате, пользователь получается роль member')
async def create_room(room_data: RoomCreate, user_id: str, role: str, service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  new_room = Room(name=room_data.name, type=room_data.type)
  await service.create_room(new_room, user_id, role)
  return SuccessResponse(
    data=new_room,
    message='Новую комнату успешно создано'
  )

@router.patch('/update_room', response_model=SuccessResponse[RoomResponse], description='Обновление комнаты, позволяет выполнять любые обновления с комнатой')
async def update_room(room_id: str, room_data: RoomUpdate, service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  updated_room = await service.update_room(room_id, **room_data.model_dump())
  return SuccessResponse(
    data=updated_room
  )

# @router.post('/invite_to_room_from_user', response_model=SuccessResponse[InviteResponse], description='Приглашения в комнату ОТ пользователя через код комнаты')
# async def invite_to_room_from_user(user_code: str, room_code: str, title: str, service: RoomService = Depends(get_room_service)):
#   invite_to_room = await service.invite_to_room_from_user(
#     user_code,
#     room_code,
#     title,
#   )
  
#   return SuccessResponse(
#     data=invite_to_room,
#     message='Приглашение пользователю успешно отправлено'
#   )
  
# @router.post('/invite_from_room_to_user', response_model=SuccessResponse[InviteResponse], description='Приглашения ИЗ комнаты через код пользователя')
# async def invite_from_room_to_user(room_code: str, user_code: str, title: str, service: RoomService = Depends(get_room_service)):
#   invite_to_room = await service.invite_from_room_to_user(
#     room_code,
#     user_code,
#     title,
#   )
#   return SuccessResponse(
#     data=invite_to_room,
#     message='Приглашение для добавления в комнату успешно отправлено'
#   )

@router.post('/delete_member_from_room', response_model=SuccessResponse[RoomResponse])
async def delete_member_from_room(room_id: str, user_id: str, member_id: str, user: User = Depends(get_user_by_refresh_token), service: RoomService = Depends(get_room_service),  is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  await service.delete_member_from_room(room_id, user_id, member_id, user.id)
  return SuccessResponse(
    message='Пользователь успешно удален из комнаты'
  )

@router.post('/delete_room', response_model=SuccessResponse[RoomResponse])
async def delete_room_by_id(room_id: str, user: User = Depends(get_user_by_refresh_token), service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  deleted_room = await service.delete_current_room(room_id, user.id)
  return SuccessResponse(
    data=deleted_room,
    message='Комната успешно удалена'
  )

# @router.get('/delete_rooms', response_model=SuccessResponse[RoomResponse])
# async def delete_rooms(service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
#   deleted_rooms = await service.delete_all_rooms()
#   return SuccessResponse(
#     data=deleted_rooms
#   )