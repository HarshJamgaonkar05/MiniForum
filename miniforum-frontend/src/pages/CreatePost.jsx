// src/pages/CreatePost.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a post");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/posts/create",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/"); // go to Home after successful post
    } catch (err) {
      console.error("Post creation failed:", err);
      setError("Failed to create post");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div className="mb-3">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>
        <div className="mb-3">
          <label>Content</label>
          <textarea
            className="form-control"
            rows={5}
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here..."
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
