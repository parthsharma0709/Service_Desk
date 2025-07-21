import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './Button';
import { MessageCircle,X } from 'lucide-react';
import UpdateTicketComponent from './updateTicket';
import CommentComponent from './commentComponent';

const Card = ({ ticketId, title, userId, desc,adminname, category, status, priority, refresh }) => {
  const [isUpdateTicket, setIsUpdateTicket] = useState(false);
  const [username, setUsername] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(
          `http://localhost:3000/api/admin/auth/getUserInfo/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setUsername(response.data.user.name);
      } catch (err) {
        console.error('Failed to fetch user info:', err.response?.data || err.message);
      }
    };

    fetchUserInfo();
  }, [userId]);

  // Delete ticket
  const deleteTicket = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `http://localhost:3000/api/admin/auth/deleteTicket/${ticketId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert('Ticket deleted successfully');
      refresh();
    } catch (error) {
      console.error('Error while deleting ticket', error.response?.data || error.message);
    }
  };
  

  console.log("username", username)

  

  return (
    <div className="inline-block">
      <div className="bg-white border border-gray-300 rounded-xl shadow-md max-w-[500px] w-full p-4 space-y-4">
        <div className="flex justify-end text-sm text-gray-600">User: {username || adminname}</div>

        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>

        <p className="text-gray-700">
          <span className="font-semibold">Description:</span> {desc}
        </p>

        <p className="text-gray-700">
          <span className="font-semibold">Category:</span> {category}
        </p>

        <div className="flex items-center gap-3">
          <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            <span className="font-semibold">Status:</span> {status}
          </span>

          <span
            className={`text-sm px-3 py-1 rounded-full font-medium ${
              priority === 'low'
                ? 'bg-green-100 text-green-700'
                : priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <span className="font-semibold">Priority:</span> {priority}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            bgColor="bg-red-600 hover:bg-red-700"
            width="w-full"
            padding="p-2"
            text="Delete Ticket"
            onClick={deleteTicket}
          />
          <Button
            bgColor="bg-purple-700 hover:bg-purple-800"
            width="w-full"
            padding="p-2"
            text="Update Ticket"
            onClick={() => setIsUpdateTicket(true)}
          />
        </div>

        {isUpdateTicket && (
          <UpdateTicketComponent
            refresh={refresh}
            ticketId={ticketId}
            open={isUpdateTicket}
            onClose={() => setIsUpdateTicket(false)}
          />
        )}

        <div className="flex items-center gap-2 mt-4">
          <h2 className="text-gray-700 font-medium">Chat with user:</h2>
          <MessageCircle
            color="blue"
            size={28}
            className="cursor-pointer hover:text-blue-700"
            onClick={() => setShowCommentBox((prev) => !prev)}
          />
        </div>

       {showCommentBox && (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-slate-700 rounded-xl p-6 w-[90%] max-w-lg relative shadow-lg">
       <X  className="absolute top-2 right-2" onClick={() => setShowCommentBox(false)} />
      <CommentComponent ticketId={ticketId} />
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default Card;
