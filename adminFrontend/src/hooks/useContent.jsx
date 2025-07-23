import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react'

export function useContent(userId=null){
    const [allUserTickets,setAllUserTicket]=useState([]);
    const [userTickets,setUserTickets]=useState([]);
         
    const refresh= async()=>{
        const token= localStorage.getItem("adminToken");
        axios.get("http://localhost:3000/api/admin/auth/superAdmin/getAllTickets",
            {
                headers :{
                    Authorization:token
                }
            }
        ).then((response)=>{
            setAllUserTicket((response.data.allTickets || []).reverse())
        })
    }

  const refreshUserTickets = async (userId) => {
    const token = localStorage.getItem("adminToken");
    try {
        const response = await axios.get(`http://localhost:3000/api/admin/auth/viewTickets/ofaUser/${userId}`, {
            headers: {
                Authorization: token
            }
        });
        setUserTickets((response.data.userTickets || []).reverse());
    } catch (error) {
        console.error("Failed to fetch user tickets", error);
    }
};


    useEffect(()=>{
        refresh();
        let interval= setInterval(()=>{
            refresh()
        },10*1000);

        return()=>{
            clearInterval(interval);
        }
    },[]);

      useEffect(() => {
    if (!userId) return;
    refreshUserTickets(userId);
    const interval = setInterval(() => refreshUserTickets(userId), 10 * 1000);
    return () => clearInterval(interval);
  }, [userId]);

   return {refresh,allUserTickets, refreshUserTickets,userTickets}
}

