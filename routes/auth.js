const express=require('express');
const router=express.Router();
const User= require('../models/User');
const tempUser= require('../models/tempUser');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET="mediaBook-2.O";
// const {body,validationResult}=require('express-validator');
const fetchuser=require('../middleware/fetchuser')
const nodemailer = require('nodemailer');



//Route 0 for email verification
router.post('/sendOtp',async (req,res)=>{
const email=req.body.email;
console.log("i am called")
let user=await User.findOne({email})
if(user){
    return res.status(400).json({msg:"Email already exists"})
}
let otp = Math.floor(1000 + Math.random() * 9000);
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dlnpriyanshu@gmail.com',
      pass: 'tohz shpi cnpu prtl'
    }
  });
  
  var mailOptions = {
    from: 'dlnpriyanshu@gmail.com',
    to: `${email}`,
    subject: 'Sending Email using Node.js',
    text: `Your one time password (OTP) is ${otp}`
    
  };
  otp=toString(otp);
  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      const salt=await bcrypt.genSalt(10);
      const encOtp=await bcrypt.hash(otp,salt)
   
        let tmpuser= new tempUser({
        email,
        otp:encOtp
    }) 
    await tmpuser.save().then(()=>{
        console.log("added")
        res.json({msg:"otp sended succesfully",status:true})
    })
    }
  });

})



//route 0.2 verifying the otp
router.post('/verifyOtp',async (req,res)=>{
    const email=req.body.email;
    const otp=req.body.otp;
    try{
    let user=await tempUser.findOne({email})
    if(!user){
        return res.status(400).json({msg:"Please try to login with correct credentials"})
    }
    const otpCompare=await bcrypt.compare(user.otp,otp)
  if(!otpCompare)
        res.json({status:true,msg:"Successfully Login"})
    else
    res.json({a:"jbh"})
    
} catch (error) {
    console.log(error.message)
    res.status(500).send({msg:"Internal server error occured"})
}

})





//Route1:create a user using :POST "/api/auth/createUser" no login required
router.post('/createUser',async (req,res)=>{
    let signup=false
  
    let user=await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({msg:"Email already exists"})
    }
    // Password hashing
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt)
    
    // User Creation
    user=await new User({
        name:req.body.name,
        email:req.body.email,
        password:secPass,
        profilePhoto:req.body.profileImg,
        bgPhoto:req.body.bgImg,
    }) 
    const data={
        user:{
            id:user.id
        }
    }
    user.save().then(()=>{
        const authToken =jwt.sign(data,JWT_SECRET);
        signup=true
        console.log(authToken)
        res.json({authToken,signup,msg:"User Created Successfully"})
    })
})

//Route2: Authenticate a user using :POST "/api/auth/login", no login required
router.post('/loginUser',async (req,res)=>{
    let login=false
   
    const {email,password}=req.body
    try {
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({msg:"Please try to login with correct credentials"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password)
        if(!passwordCompare)
        {
            return res.status(400).json({msg:"Please try to login with correct credentials"})
        }
        login=true
        const data={
            user:{
                id:user.id
            }
        }
            const authToken =jwt.sign(data,JWT_SECRET);
            res.json({authToken,login,msg:"Successfully Login"})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({msg:"Internal server error occured"})
    }
})


router.post("/message", async (req, res) => {
    try {
      console.log("Its working")
      res.json("its working")
    } catch (error) {
      res.status(404).send({ error: "No msg found" });
    }
  });


//Route3: Get logged in user details using : POST "api/auth/getUser". Login Required
router.post('/getUser', fetchuser,async (req,res)=>{
    try {
         const userId=req.user.id;
        const user= await User.findById(userId).select("-password")
        res.json(user)
        console.log(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send({msg:"Internal Server Error"})
    }
})
module.exports=router