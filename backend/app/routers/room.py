from typing import List

from fastapi import APIRouter, Depends, WebSocketDisconnect, WebSocket

from ..schemas.response import SuccessResponse
from ..schemas.room import RoomCreate, RoomResponse, RoomUpdate, RoomResponseWithMessages
from ..dependencies.services import get_room_service
from ..services import RoomService
from ..models.room import Room

router = APIRouter(prefix='/api/v1/rooms', tags=['Rooms'])

@router.get('/get_rooms', response_model=SuccessResponse[List[RoomResponse]])
async def get_rooms(service: RoomService = Depends(get_room_service)):
  rooms = await service.get_rooms()
  return SuccessResponse(
    data=rooms
  )

@router.post('/get_room_by_id', response_model=SuccessResponse[RoomResponseWithMessages])
async def get_room_by_id(room_id: str, service: RoomService = Depends(get_room_service)):
  room = await service.get_room_by_id(room_id)
  return SuccessResponse(
    data=room
  )

@router.post('/create_room', response_model=SuccessResponse[RoomResponse])
async def create_room(room_data: RoomCreate, user_id: str, role: str, service: RoomService = Depends(get_room_service)):
  new_room = Room(name=room_data.name, type=room_data.type)
  await service.create_room(new_room, user_id, role)
  return SuccessResponse(
    data=new_room,
    message='Новую комнату успешно создано'
  )
  
@router.patch('/update_room', response_model=SuccessResponse[RoomResponse])
async def update_room(room_id: str, room_data: RoomUpdate, service: RoomService = Depends(get_room_service)):
  print(room_data.model_dump())
  updated_room = await service.update_room(room_id, **room_data.model_dump())
  return SuccessResponse(
    data=updated_room
  )
  
@router.get('/delete_rooms', response_model=SuccessResponse[RoomResponse])
async def delete_rooms(service: RoomService = Depends(get_room_service)):
  deleted_rooms = await service.delete_all_rooms()
  return SuccessResponse(
    data=deleted_rooms
  )