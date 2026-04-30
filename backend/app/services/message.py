from ..repository import MessageRepository
from ..schemas.message import MessageCreate, MessageUpdate, MessageResponse
from ..core.websockets.websocket_manager import websocket_manager

class MessageService:
  def __init__(self, repository: MessageRepository):
    self.repository = repository
    
  async def get_messages(self):
    messages = await self.repository.get_messages()
    return messages
  
  async def get_messages_by_room(self, room_id: str):
    message = await self.repository.get_messages_by_room(room_id)
    return message
  
  async def get_messages_by_id(self, message_id: str):
    message = await self.repository.get_messages_by_id(message_id)
    return message
  
  async def create_message(self, message_data: MessageCreate):
    new_message = await self.repository.create_message(message_data)
    print(new_message)
    message = MessageResponse.model_validate(new_message).model_dump(mode='json')
    print('message', message)
    await websocket_manager.broadcast_to_room({"action": "new_message", "payload": message}, new_message.room_id)
    return new_message
  
  async def update_message(self, message_id: str, **message_data: MessageUpdate):
    updated_message = await self.repository.update_message(message_id, **message_data)
    return updated_message