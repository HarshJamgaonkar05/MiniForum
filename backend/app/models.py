# app/models.py

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(30), unique=True, index=True)
    hashed_password = Column(String(255))

    # One-to-many relationships with lazy="selectin"
    posts = relationship("Post", back_populates="author", lazy="selectin")
    comments = relationship("Comment", back_populates="author", lazy="selectin")

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))

    # Relationship to User
    author = relationship("User", back_populates="posts", lazy="selectin")

    # Relationship to comments
    comments = relationship("Comment", back_populates="post", lazy="selectin")

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))

    # Relationships
    author = relationship("User", back_populates="comments", lazy="selectin")
    post = relationship("Post", back_populates="comments", lazy="selectin")
