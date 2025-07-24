# app/routers/comments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app import schemas, models, auth
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/create", response_model=schemas.CommentOut)
async def create_comment(
    comment: schemas.CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_comment = models.Comment(
        content=comment.content,
        post_id=comment.post_id,
        author_id=current_user.id
    )
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    return new_comment


@router.get("/post/{post_id}", response_model=list[schemas.CommentOut])
async def get_comments_for_post(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Comment)
        .options(joinedload(models.Comment.author))  # ✅ This loads full author
        .filter(models.Comment.post_id == post_id)
    )
    return result.scalars().all()


@router.put("/{comment_id}", response_model=schemas.CommentOut)
async def update_comment(
    comment_id: int,
    updated: schemas.CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    comment = await db.get(models.Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this comment")

    comment.content = updated.content
    await db.commit()
    await db.refresh(comment)
    return comment


@router.delete("/{comment_id}")
async def delete_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    comment = await db.get(models.Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    await db.delete(comment)
    await db.commit()
    return {"detail": "Comment deleted"}

@router.get("/by-user/{user_id}", response_model=list[schemas.CommentOut])
async def get_comments_by_user(user_id: int, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    user = await db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get comments by user_id
    result = await db.execute(select(models.Comment).filter(models.Comment.author_id == user_id))
    comments = result.scalars().all()

    return comments
