from typing import List

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from ..schemas.response import SuccessResponse
from ..schemas.room import RoomCreate, RoomResponse, RoomUpdate, RoomResponseWithMessages
from ..dependencies.services import get_room_service, get_invitation_service, get_user_service
from ..services import RoomService, InviteService
from ..models import Room, User
from ..dependencies.auth import get_user_by_access_token, get_user_by_refresh_token
from ..schemas.invite import InviteCreateToRoom, InviteResponse
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

@router.post('/invite_user_to_room', response_model=SuccessResponse[InviteResponse], description='Приглашения пользователя в комнату через код')
async def invite_user_to_room(user_code: str, inviter_id: str, notification_data: NotificationCreate, invite_data: InviteCreateToRoom, service: RoomService = Depends(get_room_service)):
  invite_to_room = await service.invite_user_to_room(
    user_code,
    inviter_id,
    notification_data,
    invite_data
  )
  return SuccessResponse(
    data=invite_to_room,
    message='Приглашение пользователю успешно отправлено'
  )

@router.post('/join_to_room', response_model=SuccessResponse[InviteResponse], description='Эндпоинт для отправки приглашение в комнату по её коду')
async def join_to_room(room_code: str, notification_data: NotificationCreate, inviter_id: str, service: RoomService = Depends(get_room_service)):
  invite_to_room = await service.join_to_room(
    room_code,
    notification_data,
    inviter_id
  )
  return SuccessResponse(
    data=invite_to_room,
    message='Приглашение для добавления в комнату успешно отправлено'
  )

@router.post('/accept_room_invite', response_model=SuccessResponse[None])
async def accept_room_invite(invite_id: str, notification_id: str, user_id: str, status: str, service: InviteService = Depends(get_invitation_service)):
  await service.accept_room_invite(invite_id, notification_id, user_id, status)
  message = ''
  
  if status == 'accepted':
    message='Приглашение принято'
  else:
    message='Приглашение отклонено'
  
  return SuccessResponse(
    message=message
  )

@router.post('/delete_member_from_room', response_model=SuccessResponse[RoomResponse])
async def delete_member_from_room(room_id: str, user_id: str, member_id: str, service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  await service.delete_member_from_room(room_id, user_id, member_id)
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