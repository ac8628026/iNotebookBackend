var jwt = require('jsonwebtoken');

const JWT_SECRET='Harryisagoodb$oy';
const fetchuser= (req,res,next)=>{
    //get the user from the jwt token and add id to req object
    const token= req.header('auth-token');
    if(!token){
        res.status(401).send({error:"please login with correct detials"})

    }
   
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    next();
}

module.exports=fetchuser;