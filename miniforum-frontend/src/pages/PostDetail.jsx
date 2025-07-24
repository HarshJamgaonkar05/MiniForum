import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PostDetail() {
  const { id } = useParams(); // post ID from URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState(null);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  // Fetch post + comments + user ID
  useEffect(() => {
    async function fetchAll() {
      try {
        const [postRes, commentRes] = await Promise.all([
          axios.get(`https://miniforum.onrender.com/posts/${id}`),
          axios.get(`https://miniforum.onrender.com/comments/post/${id}`),
        ]);
        setPost(postRes.data);
        setComments(commentRes.data);
      } catch (err) {
        console.error(err);
        setError("Post not found or error occurred.");
      }

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userRes = await axios.get("https://miniforum.onrender.com/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserId(userRes.data.id);
        } catch (e) {
          console.error("Failed to fetch user ID:", e);
        }
      }
    }

    fetchAll();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Login required to comment.");
      return;
    }

    try {
      const res = await axios.post(
        "https://miniforum.onrender.com/comments/create",
        { content: newComment, post_id: parseInt(id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Comment failed:", err);
      setError("Failed to post comment.");
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditedComment(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.put(
        `https://miniforum.onrender.com/comments/${commentId}`,
        { content: editedComment, post_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(comments.map((c) => (c.id === commentId ? res.data : c)));
      setEditingCommentId(null);
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Delete this comment?")) return;

    try {
      await axios.delete(`https://miniforum.onrender.com/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`https://miniforum.onrender.com/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert(err.response?.data?.detail || "Failed to delete post");
    }
  };

  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
  if (!post) return <div className="container mt-4">Loading...</div>;

  // ✅ Fix: check author.id instead of author_id
  const isAuthor = userId === post.author?.id;

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>
      <p className="mt-3">{post.content}</p>
      <p className="text-muted mt-4">Posted by: {post.author.username}</p>

      {isAuthor && (
        <button className="btn btn-danger mb-4" onClick={handleDeletePost}>
          Delete Post
        </button>
      )}

      <hr />
      <h5 className="mt-4 mb-3">Comments</h5>

      <ul className="list-group mb-4">
        {comments.map((c) => (
          <li
            key={c.id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div className="flex-grow-1">
              <strong>{c.author.username}:</strong>
              {editingCommentId === c.id ? (
                <textarea
                  className="form-control mt-2"
                  rows={2}
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                />
              ) : (
                c.content
              )}
            </div>

            {userId === c.author_id && (
              <div className="ms-3">
                {editingCommentId === c.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-1"
                      onClick={() => handleSaveEdit(c.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingCommentId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteComment(c.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Post Comment
        </button>
      </form>
    </div>
  );
}

export default PostDetail;
