from ..schemas.response import SuccessResponse

from ..core.exceptions import AppError

from ..repository import InviteRepository, RoomRepository, MemberRepository, NotificationRepository
from ..schemas.invite import InviteCreateToRoom, InviteUpdate
from ..schemas.member import MemberCreate

class InviteService():
  def __init__(self, repository: InviteRepository, room_repository: RoomRepository, member_repository: MemberRepository, notification_repository: NotificationRepository):
    self.repository = repository
    self.room_repository = room_repository
    self.member_repository = member_repository
    self.notification_repository = notification_repository
    
  async def get_user_invitations(self, user_id: str):
    user_invitations = await self.repository.get_user_invitations(user_id)
    return user_invitations
  
  async def get_user_invite_by_id(self, user_id: str, invite_id: str):
    user_invitation = await self.repository.get_user_invite_by_id(user_id, invite_id)
    return user_invitation
  
  async def create_invite(self, inviter_id: str, user_id: str, room_id: str):
    new_user_invitation = await self.repository.create_invite(inviter_id, user_id, room_id)
    return new_user_invitation
  
  # И сразу обновить в invite_data тип на accept или cancel
  async def accept_room_invite(self, invite_id: str, notification_id: str, user_id: str, status: str):
    exist_user_invite = await self.get_user_invite_by_id(user_id, invite_id)
    exist_user_notification = await self.notification_repository.get_notification_by_id(user_id, notification_id)
    
    if exist_user_invite:
      if exist_user_invite.status in ['accepted', 'canceled']:
        raise AppError(400, 'Приглашение уже было обработано')
      
      target_room_id = exist_user_invite.room_id
    
    if exist_user_invite:
      if not exist_user_invite.room_id:
        raise AppError(400, f'Комната с ID {exist_user_invite.room_id} не найдена')
      
    is_member = await self.room_repository.check_member_in_room(target_room_id, user_id)
    
    if is_member:
      raise AppError(400, 'Вы уже являетесь участником этой комнаты')

    await self.repository.update_invite(invite_id, user_id, status)
    
    if status == 'accepted':
      member_data = MemberCreate(user_id=user_id, room_id=target_room_id, role='member')
      await self.member_repository.create_member(member_data)
    
    if exist_user_notification:
      await self.notification_repository.update_notification(user_id, exist_user_notification.id)

    return 