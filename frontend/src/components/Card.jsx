import React, { useState } from 'react';
import { Button } from './Button';
import axios from 'axios';
import UpdateTicketComponent from './updateTicket';
import { X, MessageCircle } from 'lucide-react';
import CommentComponentUser from './CommentComponentUser';

const Card = ({ ticketId, title, desc, username, category, status, priority, refresh }) => {
  const [isUpdateTicket, setIsUpdateTicket] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const deleteTicket = async () => {
    const token = localStorage.getItem("userToken");
    try {
      await axios.delete(`http://localhost:3000/api/user/auth/deleteTicket/${ticketId}`, {
        headers: {
          Authorization: token
        }
      });
      alert("Ticket deleted successfully");
      refresh();
    } catch (error) {
      console.error("Error while deleting ticket", error.response?.data || error.message);
    }
  };

  return (
    <div className="inline-block">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md max-w-[500px] w-full p-6 space-y-4">
        
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-700"><span className="font-semibold">Description:</span> {desc}</p>
        <p className="text-gray-700"><span className="font-semibold">Category:</span> {category}</p>

        <div className="flex items-center gap-3">
          <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
            Status: {status}
          </span>
          <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
            priority === 'low' ? 'bg-green-100 text-green-700' :
            priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            Priority: {priority}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            bgColor="bg-red-600 hover:bg-red-700"
            width="w-1/2"
            padding="p-2"
            text="Delete"
            onClick={deleteTicket}
          />
          <Button
            bgColor="bg-purple-700 hover:bg-purple-800"
            width="w-1/2"
            padding="p-2"
            text="Update"
            onClick={() => setIsUpdateTicket(true)}
          />
        </div>

        {isUpdateTicket && (
          <UpdateTicketComponent 
            refresh={refresh}
            ticketId={ticketId} 
            prevTitle={title}
            prevDesc={desc}
            prevStatus={status}
            prevCategory={category}
            open={isUpdateTicket} 
            onClose={() => setIsUpdateTicket(false)} 
          />
        )}

        {/* Comment Section */}
        <div className="flex items-center gap-2 mt-4">
          <h2 className="text-gray-700 font-medium">Chat with admin:</h2>
          <MessageCircle
            color="blue"
            size={28}
            className="cursor-pointer hover:text-blue-700"
            onClick={() => setShowCommentBox(prev => !prev)}
          />
        </div>

        {showCommentBox && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-lg relative shadow-xl">
              <X className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer" onClick={() => setShowCommentBox(false)} />
              <CommentComponentUser username={username} ticketId={ticketId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
