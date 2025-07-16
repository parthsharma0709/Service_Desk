import React from 'react'
import { useState } from 'react'
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
    const navigate=useNavigate();

    const [email,setEmail]=useState("");
    const [password,setPassword]= useState("");
    const signin= async()=>{
       try{
         const response= await axios.post("http://localhost:3000/api/user/signin",{
            email,
            password
        })
        if(response.data.message==="signed in successfully"){
            const userToken=response.data.token;
            localStorage.setItem("userToken",userToken)
            alert("signin successfull");
            navigate('/dashboard')
        }
       }
       catch(error){
        console.error("Error",error.response? error.response.data : error.message);
        alert("signin failed");

       }

    }


  return (
    <div className='flex flex-col '>
        
        <Input  label={"Email"} placeholder={"05sharmaparth@gmail.com"} type={"text"} onChange={(e)=>setEmail(e.target.value)}/>
        <Input  label={"Password"} placeholder={"Parth@12345"} type={"text"} onChange={(e)=>setPassword(e.target.value)}/>
           <Button text={"SignIn"} bgColor='bg-black' padding={"p-2"} onClick={signin}/> 
        
    </div>
  )
}
