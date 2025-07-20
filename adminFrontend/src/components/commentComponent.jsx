import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './Button';
import { Input } from './Input';
import { useComment } from '../hooks/useComment';
import SingleComment from './SingleComment'; // make sure it's named correctly

const CommentComponent = ({ ticketId }) => {
  const [comment, setComment] = useState("");
  const { refreshComments, allUserComments } = useComment({ ticketId });

  useEffect(() => {
    refreshComments();
  }, []);

  const addComment = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      await axios.put(
        `http://localhost:3000/api/admin/auth/addCommentToTicket/${ticketId}`,
        { text: comment },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setComment("");
      refreshComments();
    } catch (error) {
      console.error(
        "Error while adding comment to ticket",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="bg-white w-[450px] max-h-[90vh] rounded-xl border-xl shadow-lg p-4 overflow-y-auto">
      {/* Comment input */}
      <div className="flex gap-2 items-end">
        <div className="flex-grow">
          <Input
            label="Answer"
            placeholder="please restart your phone"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <Button
          text="Comment"
          onClick={addComment}
          padding="p-2"
          width="w-auto"
          disabled={!comment.trim()}
        />
      </div>

      {/* List of Comments */}
      <div className="mt-4 max-h-[250px] overflow-y-auto border-t pt-2">
        {allUserComments?.length > 0 ? (
          allUserComments.map((com, idx) => (
            <SingleComment
              key={idx}
              text={com.text}
              authorId={com.author}
              date={com.createdAt}
            />
          ))
        ) : (
          <div className="text-gray-400 text-sm">No comments yet.</div>
        )}
      </div>
    </div>
  );
};

export default CommentComponent;
