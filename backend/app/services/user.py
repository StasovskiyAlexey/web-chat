from ..core.exceptions import AppError

from ..repository import UserRepository
from ..models.user import User

class UserService:
  def __init__(self, repository: UserRepository):
    self.repository = repository
  
  async def get_user_by_id(self, id: str):
    exist_user = await self.repository.get_user_by_id(id)
    
    if not exist_user:
      raise AppError(400, f'Пользователя с ID {id} не найдено')
    
    return exist_user
  
  async def get_user_by_id_optional(self, id: str):
    return await self.repository.get_user_by_id(id)

  async def get_user_by_email(self, email: str):
    user = await self.repository.get_user_by_email(email)
    return user
  
  async def create_user(self, new_user: User):
    user = await self.repository.create_user(new_user)
    return user
  
  async def update_user(self, user_id: str, **updated_data):
    updated_user = await self.repository.update_user(user_id, **updated_data)
    return updated_user
  
  async def login_user(self, user_data: User):
    user = await self.repository.login_user(user_data)
    
    has_password_user = True if user.password else False
    setattr(user, 'has_password', has_password_user)
    
    return user