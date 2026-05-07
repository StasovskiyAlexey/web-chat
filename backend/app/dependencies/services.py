from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..repository import UserRepository, RoomRepository, MemberRepository, MessageRepository, NotificationRepository, InviteRepository

# Важно импортировать из каждого файла иначе будет ошибка циклических импортов
from ..services.user import UserService
from ..services.room import RoomService
from ..services.member import MemberService
from ..services.message import MessageService
from ..services.notification import NotificationService
from ..services.invite import InviteService

from ..core.db import get_db

def get_room_service(db: AsyncSession = Depends(get_db)):
  return RoomService(db, RoomRepository(db), UserRepository(db), MemberRepository(db), NotificationRepository(db), InviteRepository(db))

def get_member_service(db: AsyncSession = Depends(get_db)):
  return MemberService(MemberRepository(db), RoomRepository(db))

def get_user_service(db: AsyncSession = Depends(get_db)):
  return UserService(UserRepository(db))

def get_message_service(db: AsyncSession = Depends(get_db)):
  return MessageService(MessageRepository(db))

def get_notification_service(db: AsyncSession = Depends(get_db)):
  return NotificationService(NotificationRepository(db))

def get_invitation_service(db: AsyncSession = Depends(get_db)):
  return InviteService(InviteRepository(db), RoomRepository(db), MemberRepository(db), NotificationRepository(db))