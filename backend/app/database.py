# app/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "mysql+asyncmy://root:Alta2010%2A%23@localhost:3306/miniforum"
#postgresql://miniforum_db_user:he0kQZyVoivOFZwGXxjFAqeptnyl7Ceg@dpg-d20ohqjipnbc73dgkscg-a/miniforum_db
#mysql+asyncmy://root:Alta2010%2A%23@localhost:3306/miniforum

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session
