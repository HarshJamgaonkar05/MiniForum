#  MiniForum

A full-stack, Reddit-style discussion forum web app where users can sign up, create posts, comment on others' posts — all in a clean and responsive interface.

[Live Demo](https://miniforum.netlify.app)

---

## ⚙ Tech Stack

### Frontend
- **React** (with Vite)
- **React Router DOM**
- **Axios**
- **Bootstrap**
- **Netlify** (deployment)

### Backend
- **FastAPI** (Python)
- **Async SQLAlchemy 2.0**
- **PostgreSQL** (hosted on Render)
- **JWT Auth** (via `python-jose`)
- **Render** (backend + DB deployment)

---

##  Features

###  Authentication
- Signup / Login with password hashing
- JWT-based secure login
- Persistent auth with `localStorage`

###  Posts & Comments
- Create and delete posts
- Comment on posts (with edit/delete)
- View post details + comments

###  Profile Page
- View user-specific posts and comments

###  Navigation
- Mobile responsive navbar
- Conditionally rendered links (based on login state)

---

##  Deployment

- **Frontend**: Netlify (`/miniforum-frontend`)
- **Backend**: Render (`/backend`)
- **PostgreSQL**: Managed database on Render

---


