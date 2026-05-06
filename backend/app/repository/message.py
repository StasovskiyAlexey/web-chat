from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.exceptions import AppError
from ..models import Message, User

from ..schemas.message import MessageCreate, MessageUpdate

class MessageRepository():
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_messages(self):
    query = await self.db.execute(select(Message))
    messages = query.scalars().all()
    return messages
  
  async def get_messages_by_room(self, room_id: str):
    query = await self.db.execute(select(Message).where(Message.room_id == room_id))
    messages = query.scalars().all()
    return messages
  
  async def get_messages_by_id(self, message_id: str):
    query = await self.db.execute(select(Message).where(Message.id == message_id))
    message = query.scalars().first()
    return message
  
  async def create_message(self, message_data: MessageCreate):
    new_message = Message(content=message_data.content, user_id=message_data.user_id, member_id=message_data.member_id, room_id=message_data.room_id)
    
    try:
      self.db.add(new_message)
      await self.db.commit()
      await self.db.refresh(new_message)
      return new_message
    except Exception as e:
      await self.db.rollback() # Откатываем, если что-то пошло не так
      raise AppError(500, f"Ошибка при cоздании сообщения: {str(e)}")
    
  async def update_message(self, message_id: str, message_data: MessageUpdate):
    exist_message = await self.get_messages_by_id(message_id)
    
    for key, value in message_data.model_dump().items():
      if hasattr(exist_message, key):
        setattr(exist_message, key, value)
    
    try:
      await self.db.commit()
      await self.db.refresh(exist_message)
      return exist_message
    except Exception as e:
      await self.db.rollback()
      raise AppError(500, f"Ошибка при cоздании комнаты: {str(e)}")