from typing import Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class SuccessResponse(BaseModel, Generic[T]):
  status: int = 200
  message: Optional[str] = None
  data: Optional[T] = None