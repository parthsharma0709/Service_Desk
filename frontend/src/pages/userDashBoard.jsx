import React, { useEffect, useState } from 'react';
import CreateTicketComponent from '../components/CreateTicket';
import { Button } from '../components/Button';
import { useContent } from '../hooks/useContent';
import Card from '../components/Card';
import { Input } from '../components/Input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [ticketCreationOpen, setTicketCreationOpen] = useState(false);
  const { refresh, allUserTickets } = useContent();
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filterTicket, setFilterTicket] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [username, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function userInfo() {
      const token = localStorage.getItem("userToken");
      try {
        const response = await axios.get("http://localhost:3000/api/user/auth/userInfo", {
          headers: { Authorization: token },
        });
        setUserName(response.data.userDetails.name);
      } catch (err) {
        console.error("Failed to fetch user info", err.response?.data || err.message);
      }
    }
    userInfo();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    async function getFilteredTickets() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/auth/getTicket?filter=${titleFilter}`,
          { headers: { Authorization: token } }
        );
        setFilterTicket(response.data.myticket);
      } catch (err) {
        console.error('Ticket fetch error', err.response?.data || err.message);
        setFilterTicket([]);
      }
    }
    if (titleFilter.trim() !== '') {
      getFilteredTickets();
    } else {
      setFilterTicket(null);
    }
  }, [titleFilter]);

  useEffect(() => {
    refresh();
  }, [ticketCreationOpen]);

  const filteredTickets = filteredStatus
    ? allUserTickets.filter(ticket =>
        ticket.status === filteredStatus || ticket.priority === filteredStatus
      )
    : allUserTickets;

  const finalTickets = filterTicket !== null ? filterTicket : filteredTickets || [];

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-lg p-6 flex flex-col sticky top-0 h-screen">
        <h2 className="text-3xl font-bold text-purple-700 mb-10 text-center">🎫Servic Desk</h2>
        <nav className="flex flex-col justify-between flex-grow text-gray-700">
          <div className="flex flex-col gap-3">
            <Button otherStyle={"p-1 w-full"} text="📝 Create Ticket" onClick={() => setTicketCreationOpen(true)} bgColor="bg-purple-700" hover="hover:bg-purple-800" width="full" padding="3" />
            <Button otherStyle={"p-1 w-full"} text="📋 All Tickets" onClick={() => setFilteredStatus(null)} bgColor="bg-slate-700" hover="hover:bg-slate-800" width="full" padding="3" />
            <Button otherStyle={"p-1 w-full"} text="✅ Open Tickets" onClick={() => setFilteredStatus('open')} bgColor="bg-green-600" hover="hover:bg-green-700" width="full" padding="3" />
            <Button otherStyle={"p-1 w-full"} text="❌ Closed Tickets" onClick={() => setFilteredStatus('closed')} bgColor="bg-rose-600" hover="hover:bg-rose-700" width="full" padding="3" />
            <Button otherStyle={"p-1 w-full"} text="🛠 Resolved Tickets" onClick={() => setFilteredStatus('resolved')} bgColor="bg-blue-600" hover="hover:bg-blue-700" width="full" padding="3" />
            <Button otherStyle={"p-1 w-full"} text="🔧 In Progress" onClick={() => setFilteredStatus('in progress')} bgColor="bg-amber-500" hover="hover:bg-amber-600" width="full" padding="3" />
            <Button otherStyle={"p-1 w-full"} text="🟡 Low Priority" onClick={() => setFilteredStatus('low')} bgColor="bg-yellow-400" hover="hover:bg-yellow-500" width="full" padding="3" />
            <Button otherStyle={"p-1 w-full"} text="🟠 Medium Priority" onClick={() => setFilteredStatus('medium')} bgColor="bg-orange-400" hover="hover:bg-orange-500" width="full" padding="3" />
            <Button otherStyle={"p-1 w-full"} text="🔴 High Priority" onClick={() => setFilteredStatus('high')} bgColor="bg-red-500" hover="hover:bg-red-600" width="full" padding="3" />
          </div>
          <div className="mt-6">
            <Button
              text="Log Out"
              otherStyle={"p-1 w-full"}

              onClick={() => {
                localStorage.removeItem("userToken");
                alert("You have logged out. Please sign in to continue.");
                navigate("/user/signin");
              }}
              bgColor="bg-gray-500"
              hover="hover:bg-gray-600"
              width="full"
              padding="3"
            />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        
        {/* Top Navbar */}
        <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">
            Welcome, <span className="text-purple-600">{username.trim().split(" ")[0]}</span>
          </h1>
          <div className="w-full sm:w-96">
            <Input
              label="Search Ticket"
              placeholder="e.g., can't send email"
              type="text"
              otherStyle="w-full"
              onChange={(e) => setTitleFilter(e.target.value)}
            />
          </div>
        </header>

        {/* Page Title */}
         <div className="px-8 pt-6 pb-2 text-3xl text-center font-semibold text-gray-800">
          Hello {username.trim().split(' ')[0]}, here's what's happening today 👋
        </div>
        <div className="px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Tickets</h2>
          <p className="text-gray-600 text-sm mb-4">
            Showing <span className="font-semibold">{filteredStatus || 'All'}</span> Tickets
          </p>
        </div>

        {/* Create Ticket Modal */}
        <CreateTicketComponent
          open={ticketCreationOpen}
          onClose={() => setTicketCreationOpen((c) => !c)}
        />

        {/* Ticket Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 px-8 pb-10">
          {finalTickets.map((ticket) => (
            <Card
              key={ticket._id}
              ticketId={ticket._id}
              title={ticket.title}
              desc={ticket.description}
              category={ticket.category}
              status={ticket.status}
              priority={ticket.priority}
              refresh={refresh}
              username={username}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
