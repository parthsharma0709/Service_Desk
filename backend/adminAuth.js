const jwt= require("jsonwebtoken");
const JWT_SECRET="parthSharma"

function adminAuthentication(req,res,next){
    const token= req.headers['authorization'];
    if(!token){
        res.json({
            message:"token not received "
        })
        return ;
    }
    try{
        const decoded= jwt.verify(token,JWT_SECRET);
        req.adminId= decoded.adminId;
        next();
    }
    catch(error){
         res.status(403).json({ message: "Invalid or expired token" });
    }
}
module.exports=adminAuthentication