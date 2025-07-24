# app/routers/posts.py
from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app import schemas, models, auth
from typing import List
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload


router = APIRouter(prefix="/posts", tags=["Posts"])




@router.post("/create", response_model=schemas.PostOut)
async def create_post(
    post: schemas.PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_post = models.Post(
        title=post.title,
        content=post.content,
        author_id=current_user.id
    )
    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    return new_post

@router.get("/", response_model=list[schemas.PostOut])
async def get_all_posts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Post)
        .options(joinedload(models.Post.author))  # ✅ Load author info
        .order_by(models.Post.id.desc())
    )
    posts = result.scalars().all()
    return posts

@router.get("/by-user/{user_id}", response_model=list[schemas.PostOut])
async def get_posts_by_user_id(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Post)
        .options(joinedload(models.Post.author))  # ✅ This eagerly loads author
        .filter(models.Post.author_id == user_id)
    )
    posts = result.scalars().all()
    if not posts:
        raise HTTPException(status_code=404, detail="No posts found for this user")
    return posts

@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    post = await db.get(models.Post, post_id)

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    await db.delete(post)
    await db.commit()
    return {"detail": "Post deleted successfully"}

@router.get("/{post_id}", response_model=schemas.PostOut)
async def get_post_by_id(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Post)
        .options(joinedload(models.Post.author))  # ✅ load author
        .filter(models.Post.id == post_id)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

