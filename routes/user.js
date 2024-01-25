const express=require('express');
const router=express.Router();
const User= require('../models/User');
const tempUser= require('../models/tempUser');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET="mediaBook-2.O";


router.post('/searchUser',async (req,res)=>{
  
    // let user=await User.findOne({name:req.body.searchedUser})
    let user = await User.find({ name: { $regex: new RegExp(req.body.searchedUser, 'i') } });

    if(user){
        // console.log("called")
        res.json({user});
    }
    else
    res.json({msg:"no such user exists"});
})
module.exports=router
