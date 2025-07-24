# app/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Read from environment or hardcode for now (recommended to use os.getenv later)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://miniforum_user:ScjI1NYJ9d4TnyDUR8d6TlGss9SfCPSH@dpg-d21b0l2dbo4c73dvgc10-a/miniforum")

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Async session factory
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Base class for models
Base = declarative_base()

# Dependency for routes
async def get_db():
    async with SessionLocal() as session:
        yield session

