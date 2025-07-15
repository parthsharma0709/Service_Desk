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
    passowrd :{
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
     createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const ticketSchema= new mongoose.Schema({
    ticketId:ObjectId,
    userId:ObjectId,
    title:{
        type: String
        , required: true
    },
    description: { String
        , required : true
    },
    category : {
         type: String,
         required: true
    },
    priority:{
        type:String,
        enum:['Low','Medium','High'],
        default :'Medium'
    },
    status : {
        type : String,
        enum : ['Open','In Progress','Resolved','Closed'],
        default:'Open',
    },
    // admin will confirm this is the ticket is resolved or not
    resolution :{
        type: String,
        required: true
    },
    createdAt :{
             type : Date,
             default:Date.now
    }
})

const userModel= mongoose.model("user",userSchema);
const ticketModel= mongoose.model("ticket",ticketSchema);

module.exports ={
    userModel,
    ticketModel
}