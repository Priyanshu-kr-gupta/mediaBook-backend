const express=require('express');
const router=express.Router();
const User= require('../models/User');
const tempUser= require('../models/tempUser');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET="mediaBook-2.O";

router.post('/searchUser',async (req,res)=>{
  
    // let user=await User.findOne({name:req.body.searchedUser})
    let user = await User.find({ name: { $regex: new RegExp(req.body.searchedUser, 'i') } },{bgPhoto:0,password:0});
    // console.log(user)
    if(user){
        // console.log("called")
        res.json({user});
    }
    else
    res.json({msg:"no such user exists"});  
})

router.post('/getSearchedUser',async (req,res)=>{
    // console.log("i am called")
    // console.log(req.body.id)
    // console.log(req.body.suserid)
    try {
         const userId=req.body.id;
        const user= await User.findById({_id:userId},{password:0})
        
        res.json({user})
        // console.log(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send({msg:"Internal Server Error"})
    }
})

module.exports=router
