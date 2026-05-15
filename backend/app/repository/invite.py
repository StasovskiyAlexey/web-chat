from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.exceptions import AppError
from ..models import Invitation, User
from ..schemas.invite import InviteCreateToRoom, InviteUpdate

class InviteRepository():
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_user_invitations(self, user_id: str):
    query = await self.db.execute(select(Invitation).where(Invitation.user_id == user_id))
    user_invitations = query.scalars().all()
    return user_invitations
  
  async def get_user_invite_by_id(self, user_id: str, invite_id: str):
    query = await self.db.execute(select(Invitation).where(Invitation.user_id == user_id, Invitation.id == invite_id))
    user_invite = query.scalar_one_or_none()
    return user_invite
  
  async def get_active_user_invite(self, user_id: str, room_id: str):
    query = await self.db.execute(select(Invitation).where(Invitation.room_id == room_id, Invitation.user_id == user_id, Invitation.status == 'pending'))
    user_invite = query.scalar_one_or_none()
    return user_invite
  
  async def create_invite(self, inviter_id: str, user_id: str, room_id: str):
    new_invite = Invitation(inviter_id=inviter_id, user_id=user_id, room_id=room_id)
    
    try:
      self.db.add(new_invite)
      await self.db.flush()
      return new_invite
    except Exception as e:
      await self.db.rollback()
      raise AppError(500, F'Ошибка создания приглашения {e}')
    
  async def update_invite(self, invite_id: str, user_id: str, status: str):
    exist_invite = await self.get_user_invite_by_id(user_id, invite_id)
    
    if exist_invite:
      exist_invite.status = status

    await self.db.commit()
    await self.db.refresh(exist_invite)
    return exist_invite

    
  async def accept_all_user_invites(self, user_id: str):
    query = await self.db.execute(select(Invitation).where(Invitation.user_id == user_id))
    user_invites = query.scalars().all()

    for invite in user_invites:
      invite.status = 'accepted'
    
    try:
      await self.db.commit()
    except Exception as e:
      await self.db.rollback()
      raise AppError(500, F'Ошибка создания приглашения {e}')