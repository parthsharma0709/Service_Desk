require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose =require("mongoose");
app.use(express.json());
const {UserRouter} =require('./user')
const {AdminRouter}= require('./admin')

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{console.log("mongodb connected")})
.catch((e)=>console.error("database connection error" , e));




app.use('/api/user', UserRouter);
app.use('/api/admin',AdminRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



