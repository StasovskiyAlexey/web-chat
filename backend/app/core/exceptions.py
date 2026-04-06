from typing import Optional, TypeVar
from fastapi import HTTPException

T = TypeVar('T')

class AppError(HTTPException):
  def __init__(self, status_code: int, message: str, detail: Optional[T] = None):
    super().__init__(status_code=status_code, detail=message)
    self.details = detail