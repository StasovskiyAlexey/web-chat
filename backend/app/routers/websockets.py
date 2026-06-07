from fastapi import APIRouter
from ..core.websockets.websocket_manager import websocket_manager
from fastapi import APIRouter, WebSocketDisconnect, WebSocket

router = APIRouter(prefix='/api/v1/websockets')

@router.websocket("/room_connection")
async def ws_room_connection(websocket: WebSocket, room_id: str):
  await websocket_manager.connect_room(websocket, room_id)
  try:
    while True:
      message = await websocket.receive_json()
      await websocket_manager.broadcast_messages_to_room(message, room_id)
  except WebSocketDisconnect:
    websocket_manager.disconnect_room(websocket, room_id)

@router.websocket('/get_notifications')
async def ws_notifications_connection(websocket: WebSocket, user_id: str):
  await websocket_manager.connect_notification_to_user(websocket, user_id)
  
  try:
    while True:
      notification = await websocket.receive_json()
      print('notification123', notification)
      await websocket_manager.broadcast_notifications_to_user(notification, user_id)
  except WebSocketDisconnect:
    websocket_manager.disconnect_notification_to_user(websocket, user_id)