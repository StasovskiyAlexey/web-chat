from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.exceptions import AppError
from ..models import Invitation
from ..schemas.invite import InviteCreate, InviteUpdate

class InviteRepository():
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_user_invitations(self, user_id: str):
    query = await self.db.execute(select(Invitation).where(Invitation.user_id == user_id))
    user_invitations = query.scalars().all()
    return user_invitations
  
  async def get_user_invite_by_id(self, user_id: str, invite_id: str):
    query = await self.db.execute(select(Invitation).where(Invitation.user_id == user_id).where(Invitation.id == invite_id))
    user_invite = query.scalar_one_or_none()
    return user_invite
  
  async def create_invite(self, inviter_id: str, user_id: str, invite_data: InviteCreate):
    new_invite = Invitation(inviter_id=inviter_id, user_id=user_id, room_id=invite_data.room_id)
    
    try:
      self.db.add(new_invite)
      # await self.db.commit()
      # await self.db.refresh(new_invitation)
      await self.db.flush()
      return new_invite
    except Exception as e:
      await self.db.rollback()
      raise AppError(500, F'Ошибка создания приглашения {e}')
    
  async def update_invite(self, invite_id: str, user_id: str, invite_data: InviteUpdate):
    exist_invite = await self.get_user_invite_by_id(user_id, invite_id)
    
    if not exist_invite:
      raise AppError(400, f'Приглашения с ID {invite_id} не найдено')
    
    for key, value in invite_data.model_dump().items():
      if hasattr(exist_invite, key):
        setattr(exist_invite, key, value)   
    
    try:
      await self.db.commit()
      await self.db.refresh(exist_invite)
      return exist_invite
    except Exception as e:
      await self.db.rollback()
      raise AppError(500, F'Ошибка создания приглашения {e}')