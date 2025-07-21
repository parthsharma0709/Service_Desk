import { X } from 'lucide-react';
import { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import axios from 'axios';

const UpdateTicketComponent = ({
  ticketId,
  prevTitle,
  prevDesc,
  prevCategory,
  prevStatus,
  open,
  onClose,
  refresh,
}) => {
  const [ticketTitle, setTicketTitle] = useState(prevTitle || '');
  const [ticketDescription, setTicketDescription] = useState(prevDesc || '');
  const [category, setCategory] = useState(prevCategory || '');
  const [priority, setPriority] = useState(prevStatus || '');

  const submitTicket = async () => {
    const token = localStorage.getItem('userToken');

    const payload = {};
    if (ticketTitle.trim()) payload.title = ticketTitle.trim();
    if (ticketDescription.trim()) payload.description = ticketDescription.trim();
    if (category.trim()) payload.category = category.trim();
    if (priority) payload.priority = priority;

    if (Object.keys(payload).length === 0) {
      alert('Please update at least one field before submitting.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/user/auth/updateTicket/${ticketId}`,
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      onClose();
      alert('Ticket updated successfully');
      refresh();
    } catch (error) {
      console.error(
        'Error during ticket update',
        error.response?.data || error.message
      );
      alert('Error while updating ticket. Please try again.');
    }
  };

  return (
    <div>
      {open && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] max-w-[90%] h-auto rounded-xl shadow-2xl p-6 relative space-y-4">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
              onClick={onClose}
            >
              <X size={28} />
            </button>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="e.g. can't send email"
                type="text"
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
              />
              <Input
                label="Description"
                placeholder="e.g. The server is not working properly."
                type="text"
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
              />
              <Input
                label="Category"
                placeholder="e.g. Electricity issue"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <div className="flex flex-col space-y-1">
                <label className="text-sm text-slate-700 font-medium">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                className="rounded-md"
                bgColor="bg-black"
                width="w-full"
                padding="p-3"
                text="Update Ticket"
                onClick={submitTicket}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTicketComponent;
