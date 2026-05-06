from typing import List

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from ..schemas.response import SuccessResponse
from ..schemas.room import RoomCreate, RoomResponse, RoomUpdate, RoomResponseWithMessages
from ..dependencies.services import get_room_service
from ..services import RoomService
from ..models import Room, User
from ..dependencies.auth import get_user_by_access_token, get_user_by_refresh_token
from ..schemas.invite import InviteCreate, InviteResponse
from ..schemas.notification import NotificationCreate

router = APIRouter(prefix='/api/v1/rooms', tags=['Rooms'])

@router.get('/get_rooms', response_model=SuccessResponse[List[RoomResponse]])
async def get_rooms(user: User = Depends(get_user_by_refresh_token), service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  rooms = await service.get_rooms(user.id)
  return SuccessResponse(
    data=rooms
  )

@router.post('/get_room_by_id', response_model=SuccessResponse[RoomResponseWithMessages])
async def get_room_by_id(room_id: str, service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  room = await service.get_room_by_id(room_id)
  return SuccessResponse(
    data=room
  )

@router.post('/create_room', response_model=SuccessResponse[RoomResponse])
async def create_room(room_data: RoomCreate, user_id: str, role: str, service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  new_room = Room(name=room_data.name, type=room_data.type)
  await service.create_room(new_room, user_id, role)
  return SuccessResponse(
    data=new_room,
    message='Новую комнату успешно создано'
  )
  
@router.patch('/update_room', response_model=SuccessResponse[RoomResponse])
async def update_room(room_id: str, room_data: RoomUpdate, service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  print(room_data.model_dump())
  updated_room = await service.update_room(room_id, **room_data.model_dump())
  return SuccessResponse(
    data=updated_room
  )
  
@router.post('/invite_user_to_room', response_model=SuccessResponse[InviteResponse])
async def invite_user_to_room(user_code: str, inviter_id: str, notification_data: NotificationCreate, invite_data: InviteCreate, service: RoomService = Depends(get_room_service)):
  invite_to_room = await service.invite_user_to_room(
    user_code,
    inviter_id,
    notification_data,
    invite_data
  )
  return SuccessResponse(
    data=invite_to_room
  )

@router.get('/delete_rooms', response_model=SuccessResponse[RoomResponse])
async def delete_rooms(service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  deleted_rooms = await service.delete_all_rooms()
  return SuccessResponse(
    data=deleted_rooms
  )