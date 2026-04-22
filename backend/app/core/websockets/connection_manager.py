from typing import Dict, List

from fastapi import WebSocket


class ConnectionManager:
  def __init(self):
    # Храним активные соединения
    self.active_connections: Dict[str, List[WebSocket]] = {}
    
  async def connect(self, websocket: WebSocket, room_id: str):
    await websocket.accept()
    if room_id in self.active_connections:
      self.active_connections[room_id].append(websocket)
      
  def disconnect(self, websocket: WebSocket, room_id: str):
    self.active_connections[room_id].remove(websocket)
    if not self.active_connections[room_id]:
      del self.active_connections[room_id]
      
  async def broadcast_to_room(self, message: dict, room_id: str):
    # Рассылаем сообщение всем, кто сейчас в этой комнате
    if room_id in self.active_connections:
      for connection in self.active_connections[room_id]:
        await connection.send_json(message)