# app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from app import schemas, models, crud, auth
from app.database import get_db


router = APIRouter(tags=["Users"])

@router.post("/signup", response_model=schemas.UserOut)
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await auth.get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = await crud.create_user(db, user.username, user.password)
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await auth.get_user_by_username(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}


@router.delete("/delete-me")
async def delete_user_account(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    await db.delete(current_user)
    await db.commit()
    return {"detail": f"User '{current_user.username}' deleted successfully"}

# in app/routers/users.py
@router.get("/profile", response_model=schemas.UserOut)
async def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
