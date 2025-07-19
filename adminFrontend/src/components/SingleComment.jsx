import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SingleComment = ({ text, date }) => {
    const [adminname,setAdminName]=useState("");
   useEffect(() => {
  async function adminInfo() {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get("http://localhost:3000/api/admin/auth/currentAdminInfo", {
        headers: {
          Authorization: token,
        },
      });
      setAdminName(response.data.adminDetails.name);
    } catch (err) {
      console.error("Failed to fetch admin info", err.response?.data || err.message);
    }
  }
  adminInfo();
}, []);
  return (
    <div className="p-2 border-b text-sm text-gray-700">
      <div className="font-medium bg-blue-400 rounded-full pt-1 w-7 h-7 text-center">{adminname.trim().charAt(0)}</div>
      <div className='text-semibold'>{text}</div>
      <div className="text-xs text-gray-400">{new Date(date).toLocaleString()}</div>
    </div>
  );
};

export default SingleComment;
