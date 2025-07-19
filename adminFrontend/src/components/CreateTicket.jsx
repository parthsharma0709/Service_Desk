import { X } from 'lucide-react';
import { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import axios from 'axios';

const CreateTicketComponent = ({open,onClose}) => {
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const submitTicket = async () => {
    const token = localStorage.getItem("userToken");
    try {
      await axios.post(
        "http://localhost:3000/api/user/auth/createTicket",
        {
          title: ticketTitle,
          description: ticketDescription,
          category: category,
          priority: priority,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
          onClose();
      alert("ticket created successfully");
    } catch (error) {
      console.error("Error during ticket creation", error.response?.data || error.message);
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
                label={'Title'}
                placeholder={"can't send email"}
                type={'text'}
                onChange={(e) => setTicketTitle(e.target.value)}
              />
              <Input
                label={'Description'}
                placeholder={"cheater is not working properly because of some technical issue "}
                type={'text'}
                onChange={(e) => setTicketDescription(e.target.value)}
              />
              <Input
                label={'Category'}
                placeholder={"related to electricity department"}
                type={'text'}
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
                width={"w-full"}
                padding={"p-3"}
                text="Create Ticket"
                onClick={submitTicket}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTicketComponent;
