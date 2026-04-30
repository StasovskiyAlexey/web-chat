from fastapi import APIRouter
from ..core.websockets.websocket_manager import websocket_manager
from fastapi import APIRouter, WebSocketDisconnect, WebSocket

router = APIRouter(prefix='/api/v1/websockets')

@router.websocket("/room-connection")
async def ws_room_connection(websocket: WebSocket, room_id: str):
  await websocket_manager.connect(websocket, room_id)
  try:
    while True:
      data = await websocket.receive_json()
      print('data', data)
      
      await websocket_manager.broadcast_to_room(data, room_id)
  except WebSocketDisconnect:
    websocket_manager.disconnect(websocket, room_id)
