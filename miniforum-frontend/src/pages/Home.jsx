// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get("http://localhost:8000/posts/");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Posts</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {posts.length === 0 && !error && <p>No posts found.</p>}
      <div className="row">
        {posts.map((post) => (
          <div key={post.id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                  {post.content.length > 150
                    ? post.content.substring(0, 150) + "..."
                    : post.content}
                </p>
                <p className="text-muted">Posted by: {post.author.username}</p>
                <Link to={`/posts/${post.id}`} className="btn btn-primary">
                  View Post
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
