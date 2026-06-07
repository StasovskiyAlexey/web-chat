from typing import Dict, List
from fastapi import WebSocket

class WebsocketManager:
  def __init__(self):
    self.room_connections: Dict[str, List[WebSocket]] = {}
    
    self.user_notifications_connections: Dict[str, List[WebSocket]] = {}
  
  async def connect_room(self, websocket: WebSocket, room_id: str):
    await websocket.accept()
    
    if room_id not in self.room_connections:
      self.room_connections[room_id] = []
      
    self.room_connections[room_id].append(websocket)
    
  def disconnect_room(self, websocket: WebSocket, room_id: str):
    if room_id in self.room_connections:
      self.room_connections[room_id].remove(websocket)
      if not self.room_connections[room_id]:
        del self.room_connections[room_id]
  
  async def broadcast_messages_to_room(self, message: dict, room_id: str):
    if room_id not in self.room_connections:
      return
    
    lost_connections = []
    
    if room_id in self.room_connections:
      for connection in self.room_connections[room_id]:
        try:
          await connection.send_json(message)
        except Exception as e:
          lost_connections.append(connection)
          print(f'Ошибка {e}')
          
    for connection in lost_connections:
      self.room_connections[room_id].remove(connection)
  
  async def connect_notification_to_user(self, websocket: WebSocket, user_id: str):
    await websocket.accept()

    if user_id not in self.user_notifications_connections:
      self.user_notifications_connections[user_id] = []
    
    self.user_notifications_connections[user_id].append(websocket)
    
  def disconnect_notification_to_user(self, websocket: WebSocket, user_id: str):
    if user_id in self.user_notifications_connections:
      self.user_notifications_connections[user_id].remove(websocket)
      
      if not self.user_notifications_connections[user_id]:
        del self.user_notifications_connections[user_id]
    
  async def broadcast_notifications_to_user(self, notification: dict, user_id: str):
    if user_id not in self.user_notifications_connections:
      return
    print('notification_data', notification)
    lost_connections = []
    
    if user_id in self.user_notifications_connections:
      for connection in self.user_notifications_connections[user_id]:
        print('connection', connection)
        try:
          await connection.send_json(notification)
        except Exception as e:
          lost_connections.append(connection)
          print('error_socket', e)
    
    for connection in lost_connections:
      self.user_notifications_connections[user_id].remove(connection)
      
    if not self.user_notifications_connections[user_id]:
      del self.user_notifications_connections[user_id]

websocket_manager = WebsocketManager()