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
  
  # Возможно добавить тип для подтверждения инвайта
  # async def accept_invite(self, invite_id: str, notification_id: str, user_id: str, status: str):
  #   exist_user_invite = await self.get_user_invite_by_id(user_id, invite_id)
  #   exist_user_notification = await self.notification_repository.get_notification_by_id(user_id, notification_id)

  #   target_room_id = ''
  #   is_member = None
    
  #   if exist_user_invite:
  #     if exist_user_invite.status in ['accepted', 'canceled']:
  #       raise AppError(400, 'Приглашение уже было обработано')
      
  #     target_room_id = exist_user_invite.room_id
    
  #     if not exist_user_invite.room_id:
  #       raise AppError(400, f'Комната с ID {exist_user_invite.room_id} не найдена')
    
  #     is_member = await self.room_repository.check_member_in_room(target_room_id, user_id)
    
  #   if is_member:
  #     raise AppError(400, 'Вы уже являетесь участником этой комнаты')

  #   await self.repository.update_invite(invite_id, user_id, status)
    
  #   if status == 'accepted':
  #     member_data = MemberCreate(user_id=exist_user_invite.inviter_id, room_id=target_room_id, role='member')
  #     await self.member_repository.create_member(member_data)
    
  #   if exist_user_notification:
  #     await self.notification_repository.update_notification(user_id, exist_user_notification.id)
  
  async def accept_invite(self, invite_id: str, notification_id: str, user_id: str, status: str, invite_type: Literal['invite_from_room', 'invite_to_room']):
    exist_invite = await self.get_user_invite_by_id(user_id, invite_id)
    exist_notification = await self.notification_repository.get_notification_by_id(user_id, notification_id)
    
    if exist_invite:
      if not exist_invite.room_id:
        raise AppError(400, f'Комнаты с ID {exist_invite.room_id}')
    
    if exist_invite:
      if exist_invite.status in ['accepted', 'canceled']:
        raise AppError(400, 'Приглашение уже обработано')
      
    is_member = await self.room_repository.check_member_in_room(exist_invite.room_id, user_id)
    
    if is_member:
      raise AppError(400, 'Вы уже являетесь участником этой комнаты')
    
    # Приглашения из комнаты пользователю через код пользователя
    if invite_type == 'invite_from_room':
      if status == 'accepted':
        await self.repository.update_invite(invite_id, user_id, status)
        member_data = MemberCreate(user_id=exist_invite.user_id, room_id=exist_invite.room_id, role='member')
        await self.member_repository.create_member(member_data)
        await self.notification_repository.update_notification(user_id, notification_id)
      elif status == 'canceled':
        raise AppError(400, 'Приглашение отменено')
    
    # Приглашения от пользователя в комнату через код комнаты
    if invite_type == 'invite_to_room':
      if status == 'accepted':
        await self.repository.update_invite(invite_id, user_id, status)
        member_data = MemberCreate(user_id=user_id, room_id=exist_invite.room_id, role='member')
        await self.member_repository.create_member(member_data)
        await self.notification_repository.update_notification(exist_invite.user_id, notification_id)
    elif status == 'canceled':
        raise AppError(400, 'Приглашение отменено')
      
  async def accept_all_invites(self, user_id: str):
    user_invites = await self.repository.accept_all_user_invites(user_id)
    return user_invites