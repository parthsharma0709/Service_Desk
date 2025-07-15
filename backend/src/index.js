const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const {z}= require('zod');
const {userModel, ticketModel}= require('./database')

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Backend!');
});

const nameSchema=z.string().min(3,"name must have at least 3 characters").max(20);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailSchema= z.string().regex(emailRegex, { message: "Email is not valid" });
const passwordSchema=z.string().min(8).max(20)
.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
.regex(/[a-z]/, "Password must contain at least one lowercase letter")
.regex(/[0-9]/, "Password must contain at least one number")
.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

app.post

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
