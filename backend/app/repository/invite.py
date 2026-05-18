from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.exceptions import AppError
from ..models import Invite
from ..schemas.invite import InviteCreate

class InviteRepository():
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_user_invites(self, user_id: str):
    query = await self.db.execute(select(Invite).where(Invite.user_id == user_id))
    user_Invites = query.scalars().all()
    return user_Invites
  
  async def get_user_invite_by_id(self, user_id: str, invite_id: str):
    query = await self.db.execute(select(Invite).where(Invite.user_id == user_id, Invite.id == invite_id))
    user_invite = query.scalar_one_or_none()
    return user_invite
  
  async def get_active_user_invite(self, user_id: str, room_id: str):
    query = await self.db.execute(select(Invite).where(Invite.room_id == room_id, Invite.user_id == user_id, Invite.status == 'pending'))
    user_invite = query.scalar_one_or_none()
    return user_invite
  
  async def create_invite(self, inviter_id: str, user_id: str, room_id: str, type: str):
    new_invite = Invite(inviter_id=inviter_id, user_id=user_id, room_id=room_id, type=type)

    self.db.add(new_invite)
    await self.db.flush()
    return new_invite
    
  async def update_invite(self, invite_id: str, user_id: str, status: str):
    exist_invite = await self.get_user_invite_by_id(user_id, invite_id)
    
    if exist_invite:
      exist_invite.status = status

    await self.db.commit()
    await self.db.refresh(exist_invite)
    return exist_invite
    
  async def accept_all_user_invites(self, user_id: str):
    query = await self.db.execute(select(Invite).where(Invite.user_id == user_id))
    user_invites = query.scalars().all()

    for invite in user_invites:
      invite.status = 'accepted'
      
    await self.db.commit()