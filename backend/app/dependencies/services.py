from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..repository import UserRepository, RoomRepository, MemberRepository, MessageRepository
from ..services import UserService, RoomService, MemberService, MessageService

from ..core.db import get_db

def get_room_service(db: AsyncSession = Depends(get_db)):
  return RoomService(RoomRepository(db))

def get_member_service(db: AsyncSession = Depends(get_db)):
  return MemberService(MemberRepository(db), RoomRepository(db))

def get_user_service(db: AsyncSession = Depends(get_db)):
  return UserService(UserRepository(db))

def get_message_service(db: AsyncSession = Depends(get_db)):
  return MessageService(MessageRepository(db))