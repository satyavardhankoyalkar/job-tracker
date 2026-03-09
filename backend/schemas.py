from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class ApplicationCreate(BaseModel):
    company: str
    role:str
    status: str
    notes: str


class ApplicationResponse(BaseModel):
    id: int
    company: str
    role:str
    status: str
    notes: str

    class Config:
        from_attributes = True