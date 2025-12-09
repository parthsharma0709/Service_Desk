import axios from 'axios';
import { useEffect,useRef, useState } from 'react';

export function useComment({ ticketId }) {
  const [allUserComments, setAllUserComments] = useState([]);
    const [newCommentArrived, setNewCommentArrived] = useState(false);
     const prevCommentsRef = useRef([]);

  const refreshComments = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/auth/getTicketComments/${ticketId}`,
        { headers: { Authorization: token } }
      );

       const comments = (response.data.comments || []).reverse();

       if (prevCommentsRef.current.length > 0 && comments.length > prevCommentsRef.current.length) {
        setNewCommentArrived(true);
      }
             prevCommentsRef.current = comments;
      // Show latest comments first
      setAllUserComments((response.data.comments || []).reverse());
    } catch (error) {
      console.error("Failed to fetch comments:", error.response?.data || error.message);
    }
  };

  const deleteComment = async (commentId) => {
    const token = localStorage.getItem("userToken");
    try {
      await axios.delete(`http://localhost:3000/api/user/auth/deleteComment/${commentId}`, {
        headers: { Authorization: token },
      });
      refreshComments(); // Refresh after deletion
    } catch (error) {
      console.error("Failed to delete comment:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    refreshComments();
    const interval = setInterval(refreshComments, 10000);
    return () => clearInterval(interval);
  }, [ticketId]);

  return { refreshComments, allUserComments, deleteComment, newCommentArrived, setNewCommentArrived };

}
