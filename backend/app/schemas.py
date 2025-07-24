# app/schemas.py
from pydantic import BaseModel
from typing import Optional


# ----------------------
# USER SCHEMAS
# ----------------------

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

# ----------------------
# AUTH TOKEN SCHEMA
# ----------------------

class Token(BaseModel):
    access_token: str
    token_type: str

# ----------------------
# POST SCHEMAS
# ----------------------

class PostCreate(BaseModel):
    title: str
    content: str

class PostOut(BaseModel):
    id: int
    title: str
    content: str
    author: UserOut  # <-- This is the change: include full author

    class Config:
        orm_mode = True  # previously: from_attributes

# ----------------------
# COMMENT SCHEMAS
# ----------------------

class CommentCreate(BaseModel):
    content: str
    post_id: int

class CommentOut(BaseModel):
    id: int
    content: str
    post_id: int
    author: UserOut  # <-- Include full author details

    class Config:
        orm_mode = True
