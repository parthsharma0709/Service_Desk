import axios from 'axios';
import { useEffect, useState } from 'react';

export function useComment({ ticketId }) {
  const [allUserComments, setAllUserComments] = useState([]);

  const refreshComments = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/auth/getTicketComments/${ticketId}`,
        { headers: { Authorization: token } }
      );
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

  return { refreshComments, allUserComments, deleteComment };
}
