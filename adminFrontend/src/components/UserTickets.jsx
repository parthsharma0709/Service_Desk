import { useParams } from "react-router-dom";
import { useContent } from "../hooks/useContent";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

const UserTickets = () => {
  const { id, name } = useParams();
  const { userTickets } = useContent(id);
 const [filteredStatus, setFilteredStatus] = useState(null);
  const [filterTicket, setFilterTicket] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
 useEffect(() => {
  const token = localStorage.getItem("adminToken");

  async function getFilteredTickets() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/auth/auserTicket/${id}?filter=${titleFilter}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setFilterTicket(response.data.userFilteredTicket || []);
    } catch (err) {
      console.error("Ticket fetch error", err.response?.data || err.message);
      setFilterTicket([]);  
    }
  }

  if (titleFilter.trim() !== "") {
    getFilteredTickets();
  } else {
    setFilterTicket(null); 
  }
}, [titleFilter, id]);


  const filteredTickets = (filterTicket || userTickets).filter(ticket =>
    filteredStatus ? ticket.status === filteredStatus || ticket.priority === filteredStatus : true
  );

  return (
    <div className="min-h-screen flex bg-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 sticky top-0 h-screen">
        <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center"></h2>
        <div className="flex flex-col gap-3">
          <Button text="📋 All Tickets" onClick={() => setFilteredStatus(null)} otherStyle="w-full p-2" />
          <Button text="✅ Open" onClick={() => setFilteredStatus("open")} bgColor="bg-green-600" hover="hover:bg-green-700" otherStyle="w-full p-2" />
          <Button text="❌ Closed" onClick={() => setFilteredStatus("closed")} bgColor="bg-red-600" hover="hover:bg-red-700" otherStyle="w-full p-2" />
          <Button text="🛠 Resolved" onClick={() => setFilteredStatus("resolved")} bgColor="bg-blue-600" hover="hover:bg-blue-700" otherStyle="w-full p-2" />
          <Button text="🔧 In Progress" onClick={() => setFilteredStatus("in progress")} bgColor="bg-yellow-500" hover="hover:bg-yellow-600" otherStyle="w-full p-2" />
        </div>
      </aside>

       
      {/* Main Content */}
        <div className="flex flex-col mt-3">
        <div className="px-8 pt-6 pb-2 text-3xl text-center font-semibold text-gray-800">
         Hey ,  Here are the all tickets of <span className="text-green-700"> {name.trim().split(' ')[0]}.</span>
        </div>
      <main className="flex-1 p-6">
        <div className="mb-4 max-w-md">
        
          <Input
            label="Search by Title"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </div>

       <div className="px-8 pb-8">
          {Array.isArray(filteredTickets) && filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => (
                <Card
                  key={ticket._id}
                  ticketId={ticket._id}
                  userId={ticket.userId}
                  title={ticket.title}
                  desc={ticket.description}
                  category={ticket.category}
                  status={ticket.status}
                  priority={ticket.priority}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-lg mt-10">No tickets found.</div>
          )}
        </div>
      </main>

        </div>
    </div>
  );
};

export default UserTickets;
