import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/admin/signin', {
        email,
        password,
      });

      if (response.data.message === 'signed in successfully') {
        const adminToken = response.data.token;
        localStorage.setItem('adminToken', adminToken);
        alert('Sign in successful');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error', error.response ? error.response.data : error.message);
      alert('Sign in failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-white px-4'>

      <div className='bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-3xl w-full max-w-md p-8'>

        <h2 className='text-3xl font-bold text-center text-purple-800 mb-6 drop-shadow'>
          Sign In to Your Account
        </h2>

        <div className='space-y-5'>
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

          <Button className="rounded-md" bgColor="bg-purple-700" width={"w-full"} padding={"p-3"}  text="SignIn" onClick={signin}/>
        </div>

        <p className='mt-6 text-center text-sm text-gray-600'>
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/admin/register')}
            className='text-purple-700 hover:underline cursor-pointer font-medium'
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};
