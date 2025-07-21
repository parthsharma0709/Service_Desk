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

adminRouter.get('/auth/superAdmin/getAllUsers',adminAuth,async(req,res)=>{
    const adminId= req.adminId;
    const validateAdmin= await userModel.findOne({_id:adminId});
    if(validateAdmin.role==="user"){
        res.status(404).json({
            message:"Access Denied!!! "
        })
        return ;
    }
    const allUsers= await userModel.find();
    if(!allUsers.length){
           res.status(404).json({
            message:"no users founded"
        })
        return ;
    }
    res.status(200).json({
        message:"here are your all users",
        Users:allUsers
    })
})

adminRouter.get('/auth/getUser',adminAuth,async(req,res)=>{
    const filter = req.query.filter || '';

    const user= await userModel.find({
        name :{'$regex':filter, '$options': 'i'},   
    });
    
     if(!user.length){
        res.status(404).json({
            message:"user not found",
        })
        return ;
    }
    res.status(200).json({
        message:"here is your ticket",
        user:user.map(u=>({
            name:u.name,
            email:u.email,
            role:u.role,
            _id:u._id
        }))
    })

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



adminRouter.put('/auth/toggleAdmin/:id',adminAuth,async(req,res)=>{
    const id= req.params.id;
    const adminId= req.adminId;
     if(!mongoose.Types.ObjectId.isValid(id)){
        res.json({
            message:"please enter a valid  id"
        })
        return ;
    }

   let respo;
    const user= await userModel.findOne({_id:id});
    if(!user){
        res.json({message:"user not found"});
        return ;
    }
    if(user.role==="user"){
        respo= await userModel.findOneAndUpdate({_id:id},{
          $set:{
            role:"admin"
          }
       }, {new: true})
    }
    else{
         respo= await userModel.findOneAndUpdate({_id:id},{
            $set:{
                role: "user"
            }
        },
    {new: true})
    }

    if(!respo){
        res.json({message:"role not toggeled"})
    }
    res.status(200).json({
        message:"role toggled successfully ",
        updatedRoleUser:respo
    })

})


adminRouter.put('/auth/changeTicketStatus/:ticketId', adminAuth, async (req, res) => {
  const { ticketId } = req.params;
  const { ticketStatus, ticketPriority } = req.body;

  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    return res.status(404).json({
      message: "Invalid ID format, please enter a valid ID"
    });
  }

  // Only validate if ticketStatus is provided
  const allowedStatuses = ['open', 'in progress', 'resolved', 'closed'];
  if (ticketStatus && !allowedStatuses.includes(ticketStatus.toLowerCase())) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  // Build update object dynamically
  const updateFields = {};
  if (ticketStatus) updateFields.status = ticketStatus;
  if (ticketPriority) updateFields.priority = ticketPriority;

  // If nothing to update
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const updatedTicketStatus = await ticketModel.findOneAndUpdate(
    { _id: ticketId },
    { $set: updateFields },
    { new: true }
  );

  if (!updatedTicketStatus) {
    return res.status(500).json({ message: "Ticket update failed" });
  }

  res.status(200).json({
    message: "Ticket updated successfully",
    updatedTicketStatus
  });
});


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

adminRouter.get('/auth/currentAdminInfo',adminAuth,async (req,res)=>{
    const adminId= req.adminId;
    const admin= await userModel.findById({_id:adminId});
    if(!admin){
        res.status(404).json({
            message:"admin not found"
        });
        return ;
    }
    res.status(200).json({
        message:"here is your details",
        adminDetails:admin
    })
})

adminRouter.delete('/auth/deleteTicket/:id',adminAuth, async(req,res)=>{
 const id=req.params.id;

     const deletedTicket = await ticketModel.findOneAndDelete({
     _id: id
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

adminRouter.get('/auth/getTicket',adminAuth,async (req,res)=>{

 const filter = req.query.filter || '';

    const userticket= await ticketModel.find({
        title :{'$regex':filter, '$options': 'i'},   
    });

    if(!userticket.length){
        res.status(404).json({
            message:"ticket not found",
        })
        return ;
    }
    res.status(200).json({
        message:"here is your ticket",
        userticket:userticket.map(ticket=>({
            title:ticket.title,
            description:ticket.description,
            category:ticket.category,
            status:ticket.status,
            priority:ticket.priority
        }))
    })
})

adminRouter.get('/auth/getUserInfo/:id',adminAuth,async(req,res)=>{
    const id= req.params.id;
     const adminId=req.adminId;
    const isAdmin= await userModel.findOne({_id:adminId});
    if(isAdmin.role==="user"){
        res.json({
            message:"Access Denied!!!!"
        })
        return ;
    }
    const user=await userModel.findOne({_id:id});
    if(!user){
        res.status(404).json({
            message:"no user found"
        })
        return ;
    }
     res.json({
        message:"here is your user",
        user:user
     })
    
})

adminRouter.get('/auth/findAuthor/:id', adminAuth,async(req,res)=>{
    const id = req.params.id;
     if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      message: "Invalid ID format, please enter a valid ID",
    });
  }
    const author= await userModel.findOne({_id:id});
   
  if(!author){
    res.json({message:"author not found"});
    return;
  }
  res.status(200).json({
    message:"here is your author",
    author:author
  })

})


adminRouter.get('/auth/getTicketComments/:id', adminAuth, async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      message: "Invalid ID format, please enter a valid ID",
    });
  }

  const ticket = await ticketModel.findById(id);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (!ticket.comments || ticket.comments.length === 0) {
    return res.status(200).json({ message: "No comments found", comments: [] });
  }

  return res.status(200).json({
    message: "Here are all comments on this ticket",
    comments: ticket.comments,
  });
});


module.exports = { AdminRouter: adminRouter };