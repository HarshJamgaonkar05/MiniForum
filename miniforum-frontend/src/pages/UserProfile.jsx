import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, postRes, commentRes] = await Promise.all([
          axios.get(`https://miniforum.onrender.com/users/${id}`),
          axios.get(`https://miniforum.onrender.com/posts/by-user/${id}`),
          axios.get(`https://miniforum.onrender.com/comments/by-user/${id}`),
        ]);
        setUser(userRes.data);
        setPosts(postRes.data);
        setComments(commentRes.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Failed to load user profile.");
      }
    }

    fetchData();
  }, [id]);

  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
  if (!user) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>{user.username}'s Public Profile</h2>
      <p className="text-muted">User ID: {user.id}</p>

      <h4 className="mt-4">Posts</h4>
      {posts.length === 0 ? (
        <p className="text-muted">No posts yet.</p>
      ) : (
        <ul className="list-group mb-4">
          {posts.map((post) => (
            <li key={post.id} className="list-group-item">
              <Link to={`/posts/${post.id}`}>
                <strong>{post.title}</strong>
              </Link>
              <p className="mb-0 text-muted">
                {post.content.length > 100
                  ? post.content.substring(0, 100) + "..."
                  : post.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h4 className="mt-4">Comments</h4>
      {comments.length === 0 ? (
        <p className="text-muted">No comments yet.</p>
      ) : (
        <ul className="list-group">
          {comments.map((c) => (
            <li key={c.id} className="list-group-item">
              <p className="mb-1">{c.content}</p>
              <Link to={`/posts/${c.post_id}`}>
                On Post #{c.post_id}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserProfile;
