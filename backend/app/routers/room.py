from typing import List, Literal

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from ..schemas.response import SuccessResponse
from ..schemas.room import RoomCreate, RoomResponse, RoomUpdate, RoomResponseWithMessages
from ..dependencies.services import get_room_service, get_member_service
from ..services import RoomService, MemberService
from ..models import Room, User
from ..dependencies.auth import get_user_by_access_token, get_user_by_refresh_token
from ..schemas.member import MemberResponse, MemberCreate

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

@router.post('/create_room', status_code=201, response_model=SuccessResponse[RoomResponse], description='Создание комнаты, тот кто создал получает роль owner, то-есть создатель со своими правами, а при присоединении другого пользователя к комнате, пользователь получается роль member')
async def create_room(room_data: RoomCreate, user_id: str, role: Literal['member', 'owner'], service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
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
    data=updated_room,
    message='Комната успешно обновлена'
  )

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

@router.post('/add_member_to_room', status_code=201, response_model=SuccessResponse[MemberResponse], description='Эндпоинт в основном для тестов')
async def add_member(member_data: MemberCreate, service: MemberService = Depends(get_member_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  new_member = await service.create_member(member_data)
  return SuccessResponse(
    data=new_member,
    message='Пользователь успешно добавлен в комнату'
  )

# @router.get('/delete_rooms', response_model=SuccessResponse[RoomResponse])
# async def delete_rooms(service: RoomService = Depends(get_room_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
#   deleted_rooms = await service.delete_all_rooms()
#   return SuccessResponse(
#     data=deleted_rooms
#   )