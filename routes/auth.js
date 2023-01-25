const express=require('express')
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser');
const JWT_SECRET='Harryisagoodb$oy';
// ROUT 1 ;CREATE A NEW USER
router.post('/createuser',[
    body('name','enter a valid name').isLength({min:3}),
    body('email','enter a valid email').isEmail(),
    body('password').isLength({min:5})
  
],async (req,res)=>{
  console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });}
     try{
      let user=await User.findOne({email: req.body.email});
     if(user){
      return res.status(400).json({error:"sorry a user withsame email id already exist "});
     }

     const salt=await bcrypt.genSalt(10);
     scePass=await bcrypt.hash(req.body.password,salt);
    
    
     //  create a new user 
    user=await User.create({
        name: req.body.name,
        password: scePass,
        email: req.body.email,
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken = jwt.sign(data,JWT_SECRET);
     
      // res.json(user) //for show user detials in thunder clint
     res.json(authtoken);   
    }
     catch(error){
      console.error(error.message);
      res.status(500).send("some internal server error occured"); 
     }

    })
// ROUT 2 ; authentication a user using: POST "/api/auth/login"
router.post('/login',[
 
  body('email','enter a valid email').isEmail(),
  body('password','password cannot be blank').exists()

],async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

const {email,password}=req.body;
try{
  let success=false;
  let user =await User.findOne({email});
  if(!user){
    success=false;
    return res.status(400).json({error: "please try to login with correct detials"});
  }
  const passwordCompare=await bcrypt.compare(password,user.password);
  if(!passwordCompare){
    success=false;
    return res.status(400).json({error: "please try to login with correct detials"});

  }
  const data={
    user:{
      id:user.id
    }
  }
  const authtoken = jwt.sign(data,JWT_SECRET);
  success=true;
  res.json({success,authtoken});   
}
   catch(error){
    console.error(error.message);
    res.status(500).send("some internal server error occured "); 
   }
  })
  //ROUT 3 ; get loggen detials : POST "/api/auth/getuser"
  router.post('/getuser',fetchuser,async(req,res)=>{
    
    try{
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    }  catch(error){
      console.error(error.message);
      res.status(500).send(" Server Error occured");
    }
  } )
 


module.exports=router
 