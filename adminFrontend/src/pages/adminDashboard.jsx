import React, { useEffect, useState } from 'react';
import CreateTicketComponent from '../components/CreateTicket';
import { Button } from '../components/Button';
import { useContent } from '../hooks/useContent';
import Card from '../components/Card';
import { Input } from '../components/Input';
import axios from 'axios';
import { Search } from 'lucide-react';
import UserComponent from '../components/UserComponent';

const AdminDashBoard = () => {
  const [ticketCreationOpen, setTicketCreationOpen] = useState(false);
  const { refresh, allUserTickets } = useContent();
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filterTicket, setFilterTicket] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [adminname, setAdminName] = useState('');
  const [onSearch, setOnSearch] = useState(false);

  useEffect(() => {
    async function adminInfo() {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await axios.get('http://localhost:3000/api/admin/auth/currentAdminInfo', {
          headers: {
            Authorization: token,
          },
        });
        setAdminName(response.data.adminDetails.name);
      } catch (err) {
        console.error('Failed to fetch admin info', err.response?.data || err.message);
      }
    }
    adminInfo();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    async function getFilteredTickets() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/admin/auth/getTicket?filter=${titleFilter}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setFilterTicket(response.data.userticket);
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
    ? allUserTickets.filter((ticket) => ticket.status === filteredStatus || ticket.priority === filteredStatus)
    : allUserTickets;

  const finalTickets = filterTicket !== null ? filterTicket : filteredTickets || [];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-lg p-6 flex flex-col sticky top-0 h-screen">
        <h2 className="text-3xl font-bold text-purple-700 mb-10">🎫 TicketDesk</h2>
        <nav className="flex flex-col gap-4 text-gray-700">
          <Button text="📝 Create Ticket" onClick={() => setTicketCreationOpen(true)} bgColor="bg-purple-700" width="full" padding="3" hover="hover:bg-purple-800" />
          <Button text="📋 All Tickets" onClick={() => setFilteredStatus(null)} bgColor="bg-gray-800" width="full" padding="3" hover="hover:bg-gray-900" />
          <Button text="✅ Open Tickets" onClick={() => setFilteredStatus('open')} bgColor="bg-green-600" width="full" padding="3" hover="hover:bg-green-700" />
          <Button text="❌ Closed Tickets" onClick={() => setFilteredStatus('closed')} bgColor="bg-red-600" width="full" padding="3" hover="hover:bg-red-700" />
          <Button text="🛠 Resolved Tickets" onClick={() => setFilteredStatus('resolved')} bgColor="bg-blue-600" width="full" padding="3" hover="hover:bg-blue-700" />
          <Button text="🔧 In Progress" onClick={() => setFilteredStatus('in progress')} bgColor="bg-yellow-500" width="full" padding="3" hover="hover:bg-yellow-600" />
          <Button text="Low Priority" onClick={() => setFilteredStatus('low')} bgColor="bg-yellow-500" width="full" padding="3" hover="hover:bg-yellow-600" />
          <Button text="Medium Priority" onClick={() => setFilteredStatus('medium')} bgColor="bg-yellow-500" width="full" padding="3" hover="hover:bg-yellow-600" />
          <Button text="High Priority" onClick={() => setFilteredStatus('high')} bgColor="bg-yellow-500" width="full" padding="3" hover="hover:bg-yellow-600" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Navbar */}
        <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="text-2xl font-bold text-purple-700">TicketDesk Admin</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-full px-3 py-1 text-sm shadow-sm bg-gray-100 hover:bg-white transition">
              <span className="mr-2 text-gray-600">Search User</span>
              <Search onClick={() => setOnSearch((c) => !c)} className="cursor-pointer text-gray-600 hover:text-black" />
            </div>
            <div className="text-lg font-medium text-gray-700">Welcome, <span className="font-semibold text-purple-700">{adminname.trim().split(' ')[0]}</span></div>
          </div>
          {onSearch && <UserComponent onClose={() => setOnSearch((c) => !c)} />}
        </div>

        {/* Welcome Message */}
        <div className="px-8 pt-6 pb-2 text-3xl text-center font-semibold text-gray-800">
          Hello {adminname.trim().split(' ')[0]}, here's what's happening today 👋
        </div>

        {/* Ticket Search */}
        <div className="px-8 mt-4">
          <Input
            label="Search Ticket"
            placeholder="e.g., can't send email"
            type="text"
            otherStyle="w-full sm:w-96"
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </div>

        {/* Section Title */}
        <div className="px-8 my-4 text-xl font-semibold text-gray-700">
          Showing {filteredStatus ? filteredStatus : 'All'} Tickets
        </div>

        {/* Create Ticket Modal */}
        <CreateTicketComponent open={ticketCreationOpen} onClose={() => setTicketCreationOpen((c) => !c)} />

        {/* Ticket Grid */}
        <div className="px-8 pb-8">
          {Array.isArray(finalTickets) && finalTickets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {finalTickets.map((ticket) => (
                <Card
                  key={ticket._id}
                  ticketId={ticket._id}
                  userId={ticket.userId}
                  title={ticket.title}
                  desc={ticket.description}
                  category={ticket.category}
                  status={ticket.status}
                  priority={ticket.priority}
                  refresh={refresh}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-lg mt-10">No tickets found.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashBoard;
