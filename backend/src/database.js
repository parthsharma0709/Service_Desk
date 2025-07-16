const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const ObjectId= mongoose.ObjectId;

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password :{
        type:String,
        required: true,
        unique:true,
        trim:true
    },
    role :{
        type:String,
        required: true,
        enum :['user','admin'],
        default:'user',
    },
     intendedFor :{
        type:String,
        enum :['low','medium','high'],
        default:null
      }, 

     createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const ticketSchema= new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title:{
        type: String
        , required: true
    },
    description: { 
        type: String
        , required : true
    },
    category : {
         type: String,
         required: true
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default :'medium'
    },
    status : {
        type : String,
        enum : ['open','in progress','resolved','closed'],
        default:'open',
    },
     
    createdAt :{
             type : Date,
             default:Date.now
    },
    comments: [
  {
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    commentedBy: { type: String, enum: ['user', 'admin'], required: true },
    createdAt: { type: Date, default: Date.now }
  }
]
})

const userModel= mongoose.model("user",userSchema);
const ticketModel= mongoose.model("ticket",ticketSchema);

module.exports ={
    userModel,
    ticketModel
}