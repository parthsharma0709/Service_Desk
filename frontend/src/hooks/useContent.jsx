import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react'

export function useContent(){
    const [allUserTickets,setAllUserTicket]=useState([]);
         
    const refresh= async()=>{
        const token= localStorage.getItem("userToken");
        axios.get("http://localhost:3000/api/user/auth/myTickets",
            {
                headers :{
                    Authorization:token
                }
            }
        ).then((response)=>{
              setAllUserTicket((response.data.tickets || []).reverse());
        })
    }

    useEffect(()=>{
        refresh();
        let interval= setInterval(()=>{
            refresh()
        },10*1000);

        return()=>{
            clearInterval(interval);
        }
    },[]);

   return {refresh,allUserTickets}
}

