from fastapi import Depends

from ..repository import MessageRepository
from ..schemas import MessageCreate, MessageUpdate

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
    return new_message
  
  async def update_message(self, message_id: str, **message_data: MessageUpdate):
    updated_message = await self.repository.update_message(message_id, **message_data)
    return updated_message