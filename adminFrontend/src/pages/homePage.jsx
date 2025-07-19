import React from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const AdminHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-white flex flex-col items-center justify-center px-6 py-12'>

      {/* Heading */}
      <h1 className='text-4xl md:text-5xl font-extrabold text-orange-700 mb-6 text-center drop-shadow'>
        Welcome to the Admin Panel
      </h1>

      {/* About Section */}
      <div className='max-w-3xl text-center mb-12'>
        <p className='text-gray-800 text-lg md:text-xl leading-relaxed'>
          This is the <span className='font-semibold text-orange-600'>admin dashboard</span> of our secure and streamlined ticketing system.
          As an admin, you can:
        </p>
        <ul className='text-orange-700 mt-4 space-y-1 font-medium'>
          <li>🧾 View all user-submitted tickets</li>
          <li>🔧 Change ticket status and priority</li>
          <li>📊 Monitor ticket trends and user activity</li>
          <li>🔐 Manage users and system access</li>
        </ul>
      </div>

      {/* Action Cards */}
      <div className='flex flex-col md:flex-row gap-8 w-full max-w-4xl'>

        {/* Register Card */}
        <div className='bg-white bg-opacity-90 backdrop-blur shadow-lg rounded-2xl p-8 flex-1 text-center transition hover:scale-[1.02]'>
          <h2 className='text-2xl font-bold mb-3 text-gray-900'>New Admin?</h2>
          <p className='text-gray-600 mb-6'>Register with admin credentials to start managing tickets.</p>
          <Button
            className="rounded-md"
            bgColor="bg-orange-700"
            width="w-full"
            padding="p-3"
            text="Admin Register"
            onClick={() => navigate('/admin/register')}
          />
        </div>

        {/* Sign In Card */}
        <div className='bg-white bg-opacity-90 backdrop-blur shadow-lg rounded-2xl p-8 flex-1 text-center transition hover:scale-[1.02]'>
          <h2 className='text-2xl font-bold mb-3 text-gray-900'>Already an Admin?</h2>
          <p className='text-gray-600 mb-6'>Sign in to access your dashboard and manage tickets.</p>
          <Button
            bgColor="bg-orange-700"
            width="w-full"
            padding="p-3"
            text="Admin SignIn"
            onClick={() => navigate('/admin/signin')}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
