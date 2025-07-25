# app/main.py
from fastapi import FastAPI
from app.routers import users, posts, comments
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://miniforum.netlify.app"],  # allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods (POST, GET, etc.)
    allow_headers=["*"],  # allow all headers (e.g. Content-Type, Authorization)
)


app.include_router(users.router)
app.include_router(posts.router)
app.include_router(comments.router)

@app.get("/")
def root():
    return {"message": "MiniForum API is running"}
