from typing import Dict, List
from fastapi import WebSocket

class WebsocketManager:
  def __init__(self):
    
    # Массив для активных подключений к комнате
    self.room_connections: Dict[str, List[WebSocket]] = {}
    
    # Массив для оповещений пользователей
    self.user_notifications_connections: Dict[str, List[WebSocket]] = {}
  
  # Подключение комнаты
  async def connect_room(self, websocket: WebSocket, room_id: str):
    # Принимаем соединение от веб-сокета
    await websocket.accept()
    
    # Если комната не находится в подключениях сокета
    if room_id not in self.room_connections:
      # Обнуляем эту комнату
      self.room_connections[room_id] = []
    # И добавляем сокет по ключу комнаты
    self.room_connections[room_id].append(websocket)
    
  # Отключение от комнаты
  def disconnect_room(self, websocket: WebSocket, room_id: str):
    if room_id in self.room_connections:
      self.room_connections[room_id].remove(websocket)
      # Удаляем ключ комнаты, если она пустая
      if not self.room_connections[room_id]:
        del self.room_connections[room_id]
  
  # Раздача сообщений комнате
  async def broadcast_messages_to_room(self, message: dict, room_id: str):
    if room_id in self.room_connections:
      for connection in self.room_connections[room_id]:
        try:
          await connection.send_json(message)
        except Exception as e:
          print(f'Ошибка {e}')
          pass
  
  async def connect_notification_to_user(self, websocket: WebSocket, user_id: str):
    await websocket.accept()

    if user_id not in self.user_notifications_connections:
      self.user_notifications_connections[user_id] = []

    self.user_notifications_connections[user_id].append(websocket)
    
  def disconnect_notification_to_user(self, websocket: WebSocket, user_id: str):
    if user_id in self.user_notifications_connections:
      try:
        self.user_notifications_connections[user_id].remove(websocket)
      except ValueError: 
        pass
      
    if not self.user_notifications_connections[user_id]:
        del self.user_notifications_connections[user_id]
    
  async def broadcast_notifications_to_user(self, notification: dict, user_id: str):
    if user_id in self.user_notifications_connections:
      for connection in self.user_notifications_connections[user_id]:
        try:
          await connection.send_json(notification)
        except Exception:
          pass

websocket_manager = WebsocketManager()