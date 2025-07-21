import React from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-white flex flex-col items-center justify-center px-6 py-12'>

      {/* Heading */}
      <h1 className='text-4xl md:text-5xl font-extrabold text-purple-800 mb-6 text-center drop-shadow'>
        Welcome to the Service Desk
      </h1>

      {/* About Section */}
      <div className='max-w-3xl text-center mb-12'>
        <p className='text-gray-800 text-lg md:text-xl leading-relaxed'>
          This is a <span className='font-semibold text-purple-700'>secure and simple ticketing system</span> where users can raise and track support tickets efficiently.
          Whether you're facing technical issues or need help, this platform allows you to:
        </p>
        <ul className='text-purple-600 mt-4 space-y-1 font-medium'>
          <li>📝 Register and Sign In securely</li>
          <li>🎫 Create support tickets with ease</li>
          <li>⏳ Track ticket progress and status</li>
          <li>🛠️ Admins manage and resolve tickets</li>
        </ul>
      </div>

      {/* Action Cards */}
      <div className='flex flex-col md:flex-row gap-8 w-full max-w-4xl'>

        {/* Register Card */}
        <div className='bg-white bg-opacity-90 backdrop-blur shadow-lg rounded-2xl p-8 flex-1 text-center transition hover:scale-[1.02]'>
          <h2 className='text-2xl font-bold mb-3 text-gray-900'>New Here?</h2>
          <p className='text-gray-600 mb-6'>Create an account and start submitting tickets.</p>
          <Button className="rounded-md" bgColor="bg-black" width={"w-full"} padding={"p-3"}  text="Register" onClick={()=>navigate('/user/register')}/>
        </div>

        {/* Sign In Card */}
        <div className='bg-white bg-opacity-90 backdrop-blur shadow-lg rounded-2xl p-8 flex-1 text-center transition hover:scale-[1.02]'>
          <h2 className='text-2xl font-bold mb-3 text-gray-900'>Already Registered?</h2>
          <p className='text-gray-600 mb-6'>Sign in to view, manage, and track your tickets.</p>
           <Button  bgColor="bg-black" width={"w-full"} padding={"p-3"}  text="SignIn" onClick={()=>navigate('/user/signin')}/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
