const express= require("express");
require('dotenv').config();
const userRouter=express.Router();
const {z}= require('zod');
const {userModel, ticketModel}= require('./database')
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const userAuthentication= require("./auth/authorization")
const mongoose =require("mongoose");

const nameSchema=z.string().min(3,"name must have at least 3 characters").max(20);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailSchema= z.string().regex(emailRegex, { message: "Email is not valid" });
const passwordSchema=z.string().min(8).max(20)
.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
.regex(/[a-z]/, "Password must contain at least one lowercase letter")
.regex(/[0-9]/, "Password must contain at least one number")
.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");


const registerAccountSchema= z.object({
    name:nameSchema,
    email:emailSchema,
    password:passwordSchema,
   
})
const signinSchema= z.object({
    email:emailSchema,
    password:passwordSchema
})

const allowedPriorities = ['low', 'medium', 'high'];


const  prioritySchema = z
  .string()
  .refine((val) => allowedPriorities.includes(val.toLowerCase()), {
    message: "Must be one of: low, medium, or high",
  });

const allowedStatus = ['open', 'in progress', 'resolved','closed'];  

const statusSchema=z.string()
         .refine((val)=> allowedStatus.includes(val.toLowerCase()),{
            message:"mush have either of 'open', 'in progress', 'resolved','closed' "
         });


const ticketSchema=z.object({
    title:z.string().max(100).min(5, "title must have at least 5 charchters"),
    description:z.string().max(200).min(10,"must contain at least 10 characters"),
    category: z.string().max(50).min(5, "category must have at least 5 charchters"),
    priority:prioritySchema,

})

const updatedticketSchema=z.object({
    title:z.string().max(100).min(5, "title must have at least 5 charchters"),
    description:z.string().max(200).min(10,"must contain at least 10 characters"),
    category: z.string().max(50).min(5, "category must have at least 5 charchters"),
    priority:prioritySchema,

})

const hashpassword=async (password)=>{
    const saltRound=10;
    return await bcrypt.hash(password,saltRound);
}


userRouter.post('/register',async (req,res)=>{
    const validateData= registerAccountSchema.safeParse(req.body);
    if(!validateData.success){
        res.status(400).json({
            message:"Registeration failed please fill valid credintials",
            errors: validateData.error.errors
        })
        return ;
    }
    const hashedPassword= await hashpassword(validateData.data.password);
    const {name,email}=validateData.data;
    await userModel.create({
    name,
      email,
      password: hashedPassword,
     
    })
   res.status(201).json({
    message:"signed up sucessfully",
    data:validateData.data
   })
})

userRouter.post('/signin',async(req, res)=>{
    const validateData= signinSchema.safeParse(req.body);
    if(!validateData.success){
        res.status(400).json({
            message:"invalid sign in credintials",
            errors:validateData.error.errors
        })
        return ;
    }
    const {email,password}=validateData.data;
      const user= await userModel.findOne({email:email});
      if(!user || (!await bcrypt.compare(password,user.password))){
         res.status(400).json({
            message:"please enter correct username and password to continue "
        })
        return ;
      }

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET);
    
    res.status(200).json({
        message:"signed in successfully",
        token: token
    });
})

userRouter.post('/auth/createTicket', userAuthentication,async (req,res)=>{
    const validateTicket= ticketSchema.safeParse(req.body);
    const userId=req.userId;

    if(!validateTicket.success){
        res.status(403).json({
            message:"please enter valid ticket credintials",
            errors:validateTicket.error.errors
        })
        return ;
    }
    const {title,description,category,priority}=validateTicket.data;
    const existingTicket= await ticketModel.findOne({
        description:description,
        title : title});
    if(existingTicket){
        res.json({
            message:"same ticket already exist,please create a new ticket"
        });
        return ;
    }
    await ticketModel.create({
        userId,
        title,
        description,
        category,
        priority,
    })

    res.status(200).json({
        message: "ticket created successfully",
        ticket:validateTicket.data
    })
})

userRouter.get('/auth/myTickets',userAuthentication, async (req,res)=>{
    const userId=req.userId;
    const tickets= await ticketModel.find({
        userId:userId
    })
    if(!tickets.length){
        res.status(404).json({
            message:"no ticktes found"
        });
        return;
    }

    res.status(200).json({
        message:"here ur data",
        tickets:tickets
    })
})

userRouter.get('/auth/getTicket',userAuthentication,async (req,res)=>{

    const userId=req.userId;
 const filter = req.query.filter || '';


    const myticket= await ticketModel.find({
        userId:userId,
        title :{'$regex':filter, '$options': 'i'},   
    });

    if(!myticket.length){
        res.status(404).json({
            message:"ticket not found",
        })
        return ;
    }
    res.status(200).json({
        message:"here is your ticket",
        myticket:myticket.map(ticket=>({
            title:ticket.title,
            description:ticket.description,
            category:ticket.category,
            status:ticket.status,
            priority:ticket.priority
        }))
    })
})

userRouter.put('/auth/updateTicket/:id',userAuthentication,async (req,res)=>{
     const userId= req.userId;
     const id= req.params.id;
     
      const existingTicket= await ticketModel.findOne({
        userId:userId,
       _id: id 
    });
    
    if(!existingTicket){
        res.status(404).json({
            message:"no ticket to update"
        });
        return ;
    }
    const newTicketValidate= updatedticketSchema.safeParse(req.body);
    if(!newTicketValidate.success){
        res.status(400).json({
            message:"please enter valid credintials to update your ticket",
            errors:newTicketValidate.error.errors
        })
        return ;
    }
    const updatedTicket=await ticketModel.findOneAndUpdate({

          _id:id
  },
        {
             $set :{
        title:newTicketValidate.data.title,
        description :newTicketValidate.data.description,
        category : newTicketValidate.data.category,
        priority : newTicketValidate.data.priority,
    
         }
        },
        // be default it returns the data before updation now passing {new : true} it will return the updated decoument 
         { new: true } 
    )
    res.json({
        message:"ticket updated successfully",
        updatedTicket:updatedTicket
    })

})

userRouter.delete('/auth/deleteTicket/:id',userAuthentication, async(req,res)=>{
 const id=req.params.id;

     const deletedTicket = await ticketModel.findOneAndDelete({
     _id: req.params.id,      
        userId: req.userId       
});

if(!deletedTicket){
    res.json({
        message:"ticket has already deleted"
    })
    return;
}

      res.json({
        message:"ticket deleted successfully",
        deleted:deletedTicket
      })
})

userRouter.put('/auth/addCommentToTicket/:id', userAuthentication,async (req,res)=>{
    const id= req.params.id;
     if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(404).json({
                message:"Invalid I'd format , Please enter a valid Id"
            })
            return ;
           }

           const { text }= req.body;
           const userId= req.userId;

           const ticket= await ticketModel.findById(id);
           if(!ticket){
            res.json({message:"no ticket with this id exist"});
            return ;
           }

           ticket.comments.push({
            text,
            author:userId,
            commentedBy :"user",
            createdAt : new Date()
            
           })
        
           await ticket.save();

           res.status(200).json({
            message:"comment added successfully by user",
            ticket:ticket
           })

})
userRouter.get('/auth/userInfo',userAuthentication,async (req,res)=>{
    const userId= req.userId;
    const user= await userModel.findById({_id:userId});
    if(!user){
        res.status(404).json({
            message:"user not found"
        });
        return ;
    }
    res.status(200).json({
        message:"here is your details",
        userDetails:user
    })
})

module.exports = { UserRouter: userRouter }