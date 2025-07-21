import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './Button';

const SingleCommentUser = ({ text, authorId, onDelete, date,username }) => {
  const [authorname, setAuthorName] = useState('');
  console.log("authorId",authorId)

  useEffect(() => {
    async function authorInfo() {
      const token = localStorage.getItem("userToken");
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/auth/findAuthor/${authorId}`,
          {
            headers: { Authorization: token },
          }
        );
        setAuthorName(response.data.author.name);
      } catch (err) {
        console.error("Failed to fetch author info", err.response?.data || err.message);
      }
    }

    authorInfo();
  }, [authorId]);

  const style= authorname===username ? " bg-slate-300" :"bg-blue-200" ;

  return (
    <div  className={`p-4 border-b rounded-md shadow-sm ${style} hover:shadow-md transition`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            {authorname.trim().charAt(0).toUpperCase()}
          </div>
          <div className="text-sm font-medium text-gray-800">
            {authorname.trim().split(' ')[0]}
          </div>
        </div>

        <Button
          text="Delete"
          onClick={onDelete}
          otherStyle="px-3 py-1 text-sm bg-red-700 text-red-700 hover:bg-black rounded-md transition"
        />
      </div>

      <div className="text-gray-700 text-sm mb-1">{text}</div>
      <div className="text-xs text-gray-400">{new Date(date).toLocaleString()}</div>
    </div>
  );
};

export default SingleCommentUser;
