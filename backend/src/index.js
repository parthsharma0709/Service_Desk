const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const {z}= require('zod');
const {userModel, ticketModel}= require('./database')
const bcrypt= require("bcrypt");
const mongoose =require("mongoose");
const jwt= require("jsonwebtoken");
const userAuthentication= require("./auth/authorization")
const JWT_SECRET= "parthSharma";

app.use(express.json());

mongoose.connect("mongodb+srv://05sharmaparth:wo169YrK6CdxJN33@cluster0.99okb.mongodb.net/Service-Desk")
.then(()=>{console.log("mongodb connected")})
.catch((e)=>console.error("database connection error" , e))



const nameSchema=z.string().min(3,"name must have at least 3 characters").max(20);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailSchema= z.string().regex(emailRegex, { message: "Email is not valid" });
const passwordSchema=z.string().min(8).max(20)
.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
.regex(/[a-z]/, "Password must contain at least one lowercase letter")
.regex(/[0-9]/, "Password must contain at least one number")
.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
const roleSchema= z.string().min(3,"al least 3 charcters").max(20);

const registerAccountSchema= z.object({
    name:nameSchema,
    email:emailSchema,
    password:passwordSchema,
   
})
const signinSchema= z.object({
    email:emailSchema,
    password:passwordSchema
})

const allowedPrioritys = ['low', 'medium', 'high'];

const  prioritySchema = z
  .string()
  .refine((val) => allowedPrioritys.includes(val.toLowerCase()), {
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
    status:statusSchema,
})

const updatedticketSchema=z.object({
    title:z.string().max(100).min(5, "title must have at least 5 charchters"),
    description:z.string().max(200).min(10,"must contain at least 10 characters"),
    category: z.string().max(50).min(5, "category must have at least 5 charchters"),
    priority:prioritySchema,
    status:statusSchema,
})

const hashpassword=async (password)=>{
    const saltRound=10;
    return await bcrypt.hash(password,saltRound);
}

app.post('/api/register',async (req,res)=>{
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

app.post('/api/signin',async(req, res)=>{
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

    const token=jwt.sign({userId:user._id},JWT_SECRET);
    
    res.status(200).json({
        message:"signed in successfully",
        token: token
    });
})

app.post('/api/auth/createTicket', userAuthentication,async (req,res)=>{
    const validateTicket= ticketSchema.safeParse(req.body);
    const userId=req.userId;

    if(!validateTicket.success){
        res.status(403).json({
            message:"please enter valid ticket credintials",
            errors:validateTicket.error.errors
        })
        return ;
    }
    const {title,description,category,priority,status}=validateTicket.data;
    const existingTicket= await ticketModel.findOne({description:description});
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
        status
    })

    res.status(200).json({
        message: " ticket created successfully",
        ticket:validateTicket.data
    })
})

app.get('/api/auth/myTickets',userAuthentication, async (req,res)=>{
    const userId=req.userId;
    const tickets= await ticketModel.find({
        userId:userId
    })
    if(!tickets){
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

app.get('/api/auth/getTicket',userAuthentication,async (req,res)=>{

    const userId=req.userId;
 const filter = req.query.filter || '';


    const myticket= await ticketModel.find({
        userId:userId,
        title :{'$regex':filter, '$options': 'i'},   
    });

    if(!myticket){
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

app.put('/api/auth/updateTicket/:id',userAuthentication,async (req,res)=>{
     const userId= req.userId;


})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
