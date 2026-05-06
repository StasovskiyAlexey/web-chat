from ..core.exceptions import AppError

from ..repository import InviteRepository, RoomRepository, MemberRepository
from ..schemas.invite import InviteCreate, InviteUpdate
from ..schemas.member import MemberCreate

class InviteService():
  def __init__(self, repository: InviteRepository, room_repository: RoomRepository, member_repository: MemberRepository) -> None:
    self.repository = repository
    self.room_repository = room_repository
    self.member_repository = member_repository
    
  async def get_user_invitations(self, user_id: str):
    user_invitations = await self.repository.get_user_invitations(user_id)
    return user_invitations
  
  async def get_user_invite_by_id(self, user_id: str, invite_id: str):
    user_invitation = await self.repository.get_user_invite_by_id(user_id, invite_id)
    return user_invitation
  
  async def create_invite(self, inviter_id: str, user_id: str, invite_data: InviteCreate):
    new_user_invitation = await self.repository.create_invite(inviter_id, user_id, invite_data)
    return new_user_invitation
  
  # И сразу обновить в invite_data тип на accept или cancel
  async def accept_room_invite(self, room_id: str, invite_id: str, user_id: str, invite_data: InviteUpdate):
    exist_room = await self.room_repository.get_room_by_id(room_id)
    
    exist_user_invite = await self.get_user_invite_by_id(user_id, invite_id)
    
    if exist_user_invite:
      if exist_user_invite.status == 'accepted' or exist_user_invite.status == 'canceled':
        raise AppError(400, 'Приглашение в комнату уже принято или отклонено')
    
    if not exist_room:
      raise AppError(400, f'Комната с ID {room_id} не найдена')
    
    is_member_in_room = await self.room_repository.check_member_in_room(room_id, user_id)
    
    if is_member_in_room:
      raise AppError(400, 'Пользователь уже добавлен в комнату')
    
    member_data = MemberCreate(user_id=user_id, room_id=room_id, role='member')
    await self.member_repository.create_member(member_data)
    
    updated_user_invite = await self.repository.update_invite(invite_id, user_id, invite_data)
    
    return updated_user_invite