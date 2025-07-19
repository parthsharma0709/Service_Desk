import React, { useEffect, useState } from 'react';
import CreateTicketComponent from '../components/CreateTicket';
import { Button } from '../components/Button';
import { useContent } from '../hooks/useContent';
import Card from '../components/Card';
import { Input } from '../components/Input';
import axios from 'axios';


const AdminDashBoard = () => {
  const [ticketCreationOpen, setTicketCreationOpen] = useState(false);
  const { refresh, allUserTickets } = useContent();
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filterTicket, setFilterTicket] = useState([]);
  const [titleFilter, setTitleFilter] = useState('')
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
    ? allUserTickets.filter((ticket) =>  ticket.status === filteredStatus || ticket.priority === filteredStatus)
    : allUserTickets;

 const finalTickets = filterTicket !== null ? filterTicket : (filteredTickets || []);


  console.log("final ticket", filterTicket)

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-lg p-6 flex flex-col sticky top-0 h-screen">
        <h2 className="text-3xl font-bold text-purple-700 mb-10">🎫 TicketDesk</h2>
        <nav className="flex flex-col gap-4 text-gray-700">
          <Button
            text="📝 Create Ticket"
            onClick={() => setTicketCreationOpen(true)}
            bgColor="bg-purple-700"
            width="full"
            padding="3"
            hover="hover:bg-purple-800"
          />
          <Button
            text="📋 All Tickets"
            onClick={() => setFilteredStatus(null)}
            bgColor="bg-gray-800"
            width="full"
            padding="3"
            hover="hover:bg-gray-900"
          />
          <Button
            text="✅ Open Tickets"
            onClick={() => setFilteredStatus('open')}
            bgColor="bg-green-600"
            width="full"
            padding="3"
            hover="hover:bg-green-700"
          />
          <Button
            text="❌ Closed Tickets"
            onClick={() => setFilteredStatus('closed')}
            bgColor="bg-red-600"
            width="full"
            padding="3"
            hover="hover:bg-red-700"
          />
          <Button
            text="🛠 Resolved Tickets"
            onClick={() => setFilteredStatus('resolved')}
            bgColor="bg-blue-600"
            width="full"
            padding="3"
            hover="hover:bg-blue-700"
          />
          <Button
            text="🔧 In Progress"
            onClick={() => setFilteredStatus('in progress')}
            bgColor="bg-yellow-500"
            width="full"
            padding="3"
            hover="hover:bg-yellow-600"
          />
           <Button
            text="Low Priority"
            onClick={() => setFilteredStatus('low')}
            bgColor="bg-yellow-500"
            width="full"
            padding="3"
            hover="hover:bg-yellow-600"
          />
           <Button
            text="Medium Priority"
            onClick={() => setFilteredStatus('medium')}
            bgColor="bg-yellow-500"
            width="full"
            padding="3"
            hover="hover:bg-yellow-600"
          />
           <Button
            text="High Priority"
            onClick={() => setFilteredStatus('high')}
            bgColor="bg-yellow-500"
            width="full"
            padding="3"
            hover="hover:bg-yellow-600"
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h1 className="text-4xl font-semibold text-gray-800">Admin Dashboard</h1>
          <h1 className='text-3xl font-semibold'>{adminname.trim().split(" ")[0]}</h1>
          
          <Input
            label="Search Ticket"
            placeholder="e.g., can't send email"
            type="text"
            otherStyle="w-full sm:w-96"
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </div>

        <div className="mb-6 text-xl font-semibold text-gray-700 text-center">
          Showing {filteredStatus ? filteredStatus : 'All'} Tickets
        </div>

        {/* Create Ticket Modal */}
        <CreateTicketComponent
          open={ticketCreationOpen}
          onClose={() => setTicketCreationOpen((c) => !c)}
        />

        {/* Ticket Cards */}
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


      </main>
    </div>
  );
};

export default AdminDashBoard;
