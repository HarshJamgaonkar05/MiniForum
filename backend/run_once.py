import asyncio
from app.database import Base, engine
from app import models  # ensure this imports your User, Post, Comment models

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(init_models())
