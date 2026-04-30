from typing import Dict, List
from fastapi import WebSocket

class WebsocketManager:
  def __init__(self):
    self.active_connections: Dict[str, List[WebSocket]] = {}
    
  async def connect(self, websocket: WebSocket, room_id: str):
    # Принимаем соединение от веб-сокета
    await websocket.accept()
    
    # Если комната не находится в подключениях сокета
    if room_id not in self.active_connections:
      # Обнуляем эту комнату
      self.active_connections[room_id] = []
    # И добавляем сокет по ключу комнаты
    self.active_connections[room_id].append(websocket)
    
  def disconnect(self, websocket: WebSocket, room_id: str):
    if room_id in self.active_connections:
      self.active_connections[room_id].remove(websocket)
      # Удаляем ключ комнаты, если она пустая
      if not self.active_connections[room_id]:
        del self.active_connections[room_id]
      
  async def broadcast_to_room(self, message: dict, room_id: str):
    if room_id in self.active_connections:
      for connection in self.active_connections[room_id]:
        try:
          await connection.send_json(message)
        except Exception as e:
          print(f'Ошибка {e}')
          pass

websocket_manager = WebsocketManager()