import React from 'react'
import { useState } from 'react'
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Registration = () => {
    const navigate=useNavigate();

    const [name,setName]= useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]= useState("");
    const Register= async()=>{
       try{
         const response= await axios.post("http://localhost:3000/api/user/register",{
            name,
            email,
            password
        })
        if(response.data.message==="signed up sucessfully"){
            alert("registrations successfull");
            navigate('/signin')
        }
       }
       catch(error){
        console.error("Error",error.response? error.response.data : error.message);
        alert("registration failed");

       }

    }


  return (
    <div className='flex flex-col '>
        <Input  label={"Name"} placeholder={"Parth Sharma"} type={"text"} onChange={(e)=>setName(e.target.value)}/>
        <Input  label={"Email"} placeholder={"05sharmaparth@gmail.com"} type={"text"} onChange={(e)=>setEmail(e.target.value)}/>
        <Input  label={"Password"} placeholder={"Parth@12345"} type={"text"} onChange={(e)=>setPassword(e.target.value)}/>
           <Button text={"Register"} bgColor='bg-black' padding={"p-2"} onClick={Register}/> 
        
    </div>
  )
}
