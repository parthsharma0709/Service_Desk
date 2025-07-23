import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Input } from './Input';
import { X } from 'lucide-react';
import { Button } from '../../../frontend/src/components/Button';
import { useNavigate } from 'react-router-dom';

const UserComponent = ({ onClose }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [adminId,setAdminId]=useState("");

   useEffect(() => {
    async function adminInfo() {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await axios.get('http://localhost:3000/api/admin/auth/currentAdminInfo', {
          headers: {
            Authorization: token,
          },
        });
        setAdminId(response.data.adminDetails._id);
      } catch (err) {
        console.error('Failed to fetch admin info', err.response?.data || err.message);
      }
    }
    adminInfo();
  }, []);

  console.log("adminId" ,adminId);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    async function getUsers() {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/admin/auth/getUser?filter=${filter}`, {
          headers: {
            Authorization: token,
          },
        });
        setAllUsers(response.data.user);
      } catch (err) {
        console.error('Users fetch error', err.response?.data || err.message);
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    }

    getUsers();
  }, [filter]);

  const toggleAdmin = async (id) => {
  const token = localStorage.getItem("adminToken");

  if (!adminId) {
    alert("Still loading admin data. Please try again.");
    return;
  }

  if (adminId === id) {
    alert("You can't  yourself as admin...");
    return;
  }

  try {
    await axios.put(
      `http://localhost:3000/api/admin/auth/toggleAdmin/${id}`,
      {},
      { headers: { Authorization: token } }
    );
    setAllUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u
      )
    );
  } catch (error) {
    alert(error.response?.data?.message || "Toggle failed");
    console.error("Error toggling admin role", error.response?.data || error.message);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white w-[550px] max-h-[90vh] rounded-xl shadow-lg p-4 relative flex flex-col">
        
        {/* Close & Input */}
        <div className="sticky top-0 z-10 bg-white pb-4">
          <X
            className="absolute top-2 right-2 text-gray-500 hover:text-black text-3xl font-bold cursor-pointer"
            onClick={onClose}
          />
          <Input
            label="Search User"
            onChange={(e) => setFilter(e.target.value)}
            type="text"
            value={filter}
          />
        </div>

        {/* Scrollable User List */}
        <div className="overflow-y-auto mt-2 space-y-2 max-h-[65vh] pr-2">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : allUsers.length > 0 ? (
            allUsers.map((user) => (
              <div
                key={user._id}
                className="p-3 border rounded-md shadow-sm text-sm flex justify-between items-center"
              >
                <div>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </div>
                <Button
                  onClick={() => toggleAdmin(user._id)}
                  otherStyle={"p-2 text-xs rounded-md border  hover:bg-purple-600"}
                  bgColor='bg-black'
                  text={`${user.role === "admin" ? "Remove Admin" : "Make Admin"}`}
                />
                  
                
             <Button
  text={"View all tickets"}
  otherStyle={"p-2 hover:bg-black rounded"}
  
  onClick={() => navigate(`/admin/user-tickets/${user._id}/${user.name}`)}
/>

              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
