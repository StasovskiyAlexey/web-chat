from typing import List

from fastapi import APIRouter, Depends, WebSocketDisconnect, WebSocket

from ..schemas.response import SuccessResponse
from ..schemas.room import RoomCreate, RoomResponse, RoomUpdate
from ..dependencies.services import get_room_service
from ..services import RoomService
from ..models.room import Room

from ..core.websockets.connection_manager import ConnectionManager

router = APIRouter(prefix='/api/v1/rooms', tags=['Rooms'])

manager = ConnectionManager()

@router.websocket("/ws/room-connection")
async def websocket_endpoint(websocket: WebSocket, room_id: str, member_id: str):
  await manager.connect(websocket, room_id)
  try:
    while True:
      # Ожидаем сообщение от клиента
      data = await websocket.receive_json()
      
      # В реальности здесь нужно:
      # 1. Сохранить сообщение в БД через репозиторий
      # 2. Обогатить данными (имя пользователя, аватар)
      
      # Рассылаем всем в комнате
      await manager.broadcast_to_room(data, room_id)  
  except WebSocketDisconnect:
    manager.disconnect(websocket, room_id)

@router.get('/get_rooms', response_model=SuccessResponse[List[RoomResponse]])
async def get_room(service: RoomService = Depends(get_room_service)):
  rooms = await service.get_rooms()
  return SuccessResponse(
    data=rooms
  )

@router.get('/get_room_by_id', response_model=SuccessResponse[RoomResponse])
async def get_room_by_id(room_id: str, service: RoomService = Depends(get_room_service)):
  room = await service.get_room_by_id(room_id)
  return SuccessResponse(
    data=room
  )

@router.post('/create_room', response_model=SuccessResponse[RoomResponse])
async def create_room(room_data: RoomCreate, service: RoomService = Depends(get_room_service)):
  new_room = Room(name=room_data.name, type=room_data.type)
  await service.create_room(new_room)
  return SuccessResponse(
    data=new_room
  )
  
@router.patch('/update_room', response_model=SuccessResponse[RoomResponse])
async def update_room(room_id: str, room_data: RoomUpdate, service: RoomService = Depends(get_room_service)):
  print(room_data.model_dump())
  updated_room = await service.update_room(room_id, **room_data.model_dump())
  return SuccessResponse(
    data=updated_room
  )