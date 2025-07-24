import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    if (!token) {
      setError("Not logged in");
      return;
    }

    try {
      const userRes = await axios.get("http://localhost:8000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const [commentRes, postRes] = await Promise.all([
        axios.get(`http://localhost:8000/comments/by-user/${userRes.data.id}`),
        axios.get(`http://localhost:8000/posts/by-user/${userRes.data.id}`),
      ]);

      setComments(commentRes.data);
      setPosts(postRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startEditing = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleUpdate = async (commentId) => {
    try {
      await axios.put(
        `http://localhost:8000/comments/${commentId}`,
        {
          content: editedContent,
          post_id: comments.find((c) => c.id === commentId).post_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingCommentId(null);
      setEditedContent("");
      fetchData();
    } catch (err) {
      console.error("Failed to update comment:", err);
      alert("Error updating comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`http://localhost:8000/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Error deleting comment");
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {user && (
        <>
          <div className="card p-3 mt-3 mb-4">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>

          {/* USER'S POSTS */}
          <h5 className="mt-4">My Posts</h5>
          {posts.length === 0 ? (
            <p className="text-muted">You haven’t posted anything yet.</p>
          ) : (
            <ul className="list-group mb-4">
              {posts.map((post) => (
                <li key={post.id} className="list-group-item">
                  <Link to={`/posts/${post.id}`}>
                    <h6 className="mb-1">{post.title}</h6>
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

          {/* USER'S COMMENTS */}
          <h5 className="mt-4">My Comments</h5>
          {comments.length === 0 ? (
            <p className="text-muted">You haven’t commented yet.</p>
          ) : (
            <ul className="list-group">
              {comments.map((c) => (
                <li key={c.id} className="list-group-item d-flex flex-column">
                  <div className="mb-2 w-100">
                    <Link to={`/posts/${c.post_id}`}>
                      <strong>On Post #{c.post_id}</strong>
                    </Link>
                  </div>

                  {editingCommentId === c.id ? (
                    <textarea
                      className="form-control mb-2"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <div className="mb-2">{c.content}</div>
                  )}

                  <div className="d-flex gap-2">
                    {editingCommentId === c.id ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdate(c.id)}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => startEditing(c.id, c.content)}>Edit</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {!user && !error && <p>Loading...</p>}
    </div>
  );
}

export default Profile;
