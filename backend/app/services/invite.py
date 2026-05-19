from typing import Literal

from ..core.exceptions import AppError
from ..repository import InviteRepository, RoomRepository, MemberRepository, NotificationRepository
from ..schemas.member import MemberCreate
from ..schemas.invite import InviteCreate

class InviteService():
  def __init__(self, repository: InviteRepository, room_repository: RoomRepository, member_repository: MemberRepository, notification_repository: NotificationRepository):
    self.repository = repository
    self.room_repository = room_repository
    self.member_repository = member_repository
    self.notification_repository = notification_repository
    
  async def get_user_invitations(self, user_id: str):
    user_invitations = await self.repository.get_user_invites(user_id)
    return user_invitations
  
  async def get_user_invite_by_id(self, user_id: str, invite_id: str):
    user_invitation = await self.repository.get_user_invite_by_id(user_id, invite_id)
    return user_invitation
  
  async def create_invite(self, inviter_id: str, user_id: str, room_id: str, type: str):
    new_user_invitation = await self.repository.create_invite(inviter_id, user_id, room_id, type)
    return new_user_invitation
  
  async def accept_invite(self, invite_id: str, notification_id: str, user_id: str, status: str):
    exist_invite = await self.get_user_invite_by_id(user_id, invite_id)
    exist_notification = await self.notification_repository.get_notification_by_id(user_id, notification_id)
    
    if not exist_invite.room_id:
      raise AppError(400, f'Комнаты с ID {exist_invite.room_id}')
    
    if exist_invite.status in ['canceled', 'accepted']:
      raise AppError(400, 'Приглашение уже обработано')
    
    if exist_notification:
      await self.notification_repository.read_notification(user_id, notification_id)
      
    if status == 'accepted':
      await self.repository.update_invite(invite_id, user_id, status)
      
      member_data = None
      
      if exist_invite.type == 'invite_from_room':
        member_data = MemberCreate(user_id=exist_invite.user_id, room_id=exist_invite.room_id, role='member')
      else:
        member_data = MemberCreate(user_id=exist_invite.inviter_id, room_id=exist_invite.room_id, role='member')
      
      await self.member_repository.create_member(member_data)
      await self.notification_repository.read_notification(exist_invite.user_id, notification_id)
    
    # Для обновления самого статуса инвайта
    await self.repository.update_invite(invite_id, exist_invite.user_id, status)

  async def accept_all_invites(self, user_id: str):
    user_invites = await self.repository.accept_all_user_invites(user_id)
    return user_invites