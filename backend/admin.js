const express= require("express");
require('dotenv').config();
const adminRouter=express.Router();
const {z}= require('zod');
const {userModel, ticketModel}= require('./database')
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const adminAuth= require('./auth/adminAuth');
const { default: mongoose } = require("mongoose");

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


adminRouter.post('/register',async (req,res)=>{
    const validateData= registerAccountSchema.safeParse(req.body);
    if(!validateData.success){
        res.status(400).json({
            message:"Registeration failed please fill valid credintials",
            errors: validateData.error.errors
        })
        return ;
    }
    const hashedPassword= await hashpassword(validateData.data.password);
    const {name,email,role}=validateData.data;
    await userModel.create({
    name,
      email,
      password: hashedPassword,
      role:"admin"
     
    })
   res.status(201).json({
    message:"signed up sucessfully",
    data:validateData.data
   })
})

adminRouter.post('/signin',async(req, res)=>{
    const validateData= signinSchema.safeParse(req.body);
    if(!validateData.success){
        res.status(400).json({
            message:"invalid sign in credintials",
            errors:validateData.error.errors
        })
        return ;
    }
    const {email,password}=validateData.data;
      const admin= await userModel.findOne({email:email});
      if(!admin || (!await bcrypt.compare(password,admin.password))){
         res.status(400).json({
            message:"please enter correct username and password to continue "
        })
        return ;
      }

    const token=jwt.sign({adminId:admin._id},process.env.JWT_SECRET);
    
    res.status(200).json({
        message:"signed in successfully",
        token: token
    });
})

adminRouter.get('/auth/superAdmin/getAllTickets',adminAuth,async(req,res)=>{
    const adminId=req.adminId;
    const isAdmin= await userModel.findOne({_id:adminId});
    if(isAdmin.role==="user"){
        res.json({
            message:"Access Denied!!!!"
        })
        return ;
    }
    const allTickets= await ticketModel.find();
    if(!allTickets.length){
        res.status(404).json({
            message:"no ticktes for admin"
        })
        return ;
    }
    res.json({
        message:"hey admin here are your all tickets",
        allTickets:allTickets
    })

})

adminRouter.put('/auth/promoteToAdmin/:id/:role',adminAuth,async (req,res)=>{
           const { id,role}=req.params;
           if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(404).json({
                message:"Invalid I'd format , Please enter a valid Id"
            })
            return ;
           }
           const newAdmin= await userModel.findOne({_id:id});
           if(!newAdmin){
            res.status(404).json({
                message:"Invalid userId "
            })
            return ;
           }

           const wannaBeAdmin= await userModel.findOneAndUpdate({_id:id}
            ,{
                $set :{
                    role:"admin",
                  intendedFor:role,
                }
            },
            {new: true}
           )

           if(!wannaBeAdmin){
            res.status(404).json({
                message:"no new admin is created",
                errors:errors
            })
            return ;
           }
      res.status(200).json({
        message:"new admin created successfully",
        newAdmin:wannaBeAdmin
      })

})

adminRouter.put('/auth/changeTicketStatus/:ticketId/:ticketStatus',adminAuth, async (req,res)=>{
    const { ticketId,ticketStatus}= req.params;
    if(!mongoose.Types.ObjectId.isValid(ticketId)){
            res.status(404).json({
                message:"Invalid I'd format , Please enter a valid Id"
            })
            return ;
           }

           const allowedStatuses = ['open', 'in progress', 'resolved', 'closed'];
        if (!allowedStatuses.includes(ticketStatus.toLowerCase())) {
             res.status(400).json({ message: "Invalid status value" })
              return;
               }


        const updatedTicketStatus= await ticketModel.findOneAndUpdate(
            {
                _id:ticketId
            },
            {
                $set:{
                    status:ticketStatus
                }
            },
            {new : true}
        )

        if(!updatedTicketStatus){
            res.json({
                message:"ticket status not updated"
            });
            return ;
        }
        res.status(200).json({
            message:"ticket status updated successfully",
            updatedTicketStatus:updatedTicketStatus
        })

})

adminRouter.put('/auth/addCommentToTicket/:id', adminAuth,async (req,res)=>{
    const id= req.params.id;
     if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(404).json({
                message:"Invalid I'd format , Please enter a valid Id"
            })
            return ;
           }

           const { text }= req.body;
           const adminId= req.adminId;

           const ticket= await ticketModel.findById(id);
           if(!ticket){
            res.json({message:"no ticket with this id exist"});
            return ;
           }

           ticket.comments.push({
            text,
            author:adminId,
            commentedBy :"admin",
            createdAt : new Date()
            
           })
        
           await ticket.save();

           res.status(200).json({
            message:"comment added successfully by admin",
            ticket:ticket
           })

})

module.exports = { AdminRouter: adminRouter };