const express=require('express');
const router=express.Router();
const User= require('../models/User');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET="mediaBook-2.O";
const Connections = require("../models/connections")
const fetchuser = require("../middleware/fetchuser");
const connections = require('../models/connections');
const notification = require('../models/notification');
router.post('/searchUser',async (req,res)=>{
  
    let user = await User.find({ name: { $regex: new RegExp(req.body.searchedUser, 'i') } },{bgPhoto:0,password:0});
    if(user){
        res.json({user});
    }
    else
    res.json({msg:"no such user exists"});  
})

router.post('/getSearchedUser',async (req,res)=>{
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

router.post('/connect',fetchuser,async(req,res)=>{
    try{
        const sender=req.user.id;
        const receiver=req.body.receiver;
        const connection=await new Connections({
            sender,
            receiver
        }) 
        connection.save().then(()=>{
            res.json({msg:"req sended"})
        })
               
    }
    catch{
        res.status(500).send({msg:"Internal Server Error please try aftersome time"})

    }
})

router.post('/fetchRequests',fetchuser,async (req,res)=>{
    try {
        const userId=req.user.id;
        // console.log(userId)
        const connect= await connections.find({receiver:userId,status:0})
        // console.log(connect)
        const requestsUserDetails = await Promise.all(connect.map(async (reqUser) => {
            return await User.findById(reqUser.sender, { password: 0 });
        }));


            res.json({requestsUserDetails})
    } catch (error) {
        console.error(error.message)
        res.status(500).send({msg:"Internal Server Error"})
    }
})

router.post('/acceptRequest',fetchuser,async (req,res)=>{
    const userId=req.user.id;
    const reqid=req.body.reqid;
    const result = await connections.updateOne({sender: reqid,receiver: userId},{
        $set: {
          status:1,
        }
    }
)

res.json(result.acknowledged)
}
)


router.post('/getConnections',fetchuser,async (req,res)=>{
    const userId=req.user.id;
    
    const result = await connections.find({
        $or: [
            { sender: userId, status: 1 },
            { receiver: userId, status: 1 }
          ]
      })
      const allConnections = await Promise.all(result.map(async (reqUser) => {
        if(reqUser.sender===userId)
            return await User.findById(reqUser.receiver)
        else
            return await User.findById(reqUser.sender)
                
    }));
    res.json({allConnections});
}
)
router.post('/getNotifications',fetchuser,async (req,res)=>{
    const userId=req.user.id;
    
    const result = await notification.find({reciever: userId});
// console.log(result)
res.json(result)
}
)
router.post('/getNotificationsCnt',fetchuser,async (req,res)=>{
    const userId=req.user.id;
    
    const result = await notification.find({reciever: userId});
// res.json(result.size())
res.json(result.length);
}
)


module.exports=router
