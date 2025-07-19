import axios from 'axios';
import { useEffect, useState } from 'react';

export function useComment({ ticketId }) {
  const [allUserComments, setAllUserComments] = useState([]);

  const refreshComments = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/auth/getTicketComments/${ticketId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAllUserComments(response.data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    refreshComments();
    const interval = setInterval(refreshComments, 10 * 1000);
    return () => clearInterval(interval);
  }, [ticketId]);

  return { refreshComments, allUserComments };
}
