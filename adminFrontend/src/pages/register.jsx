import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Registration = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const Register = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/admin/register', {
        name,
        email,
        password,
      });

      if (response.data.message === 'signed up sucessfully') {
        alert('Registration successful');
        navigate('/admin/signin');
      }
    } catch (error) {
      console.error('Error', error.response ? error.response.data : error.message);
      alert('Registration failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-indigo-200 to-white px-4'>
      <div className='bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-3xl w-full max-w-md p-8'>
        <h2 className='text-3xl font-bold text-center text-purple-800 mb-6 drop-shadow-sm'>
          Create Your Account
        </h2>

        <div className='space-y-5'>
          <Input
            label={'Name'}
            placeholder={'Parth Sharma'}
            type={'text'}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label={'Email'}
            placeholder={'05sharmaparth@gmail.com'}
            type={'email'}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={'Password'}
            placeholder={'••••••••••'}
            type={'password'}
            onChange={(e) => setPassword(e.target.value)}
          />
 
 <Button className="rounded-md" bgColor="bg-black" width={"w-full"} padding={"p-3"}  text="Register" onClick={Register}/>

        </div>

        <p className='mt-6 text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/user/signin')}
            className='text-purple-700 hover:underline cursor-pointer font-medium'
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};
