const express=require('express');
const router=express.Router();
const User= require('../models/User');
const fetchuser=require('../middleware/fetchuser')
const Post=require('../models/Post')


//Route 1 for uploading post
router.post('/addPost',fetchuser,async (req,res)=>{

    try {
        const likes=0;
        const {caption,postImg}=req.body    
        
        const post=new Post({
            user:req.user.id,caption,postImg,likes
        })
        const savedpost= await post.save()
    
        res.json(savedpost)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({msg:"Internal server error occured"})
    }
  

})

//Route 2 for showing post

router.post("/getAllPosts", async (req, res) => {
    try {
      const allPosts = await Post.find({ });
    //   console.log(allPosts)
      res.json(allPosts);
    } catch (error) {
      res.status(404).send({ error: "No notes found for this user" });
    }
});

//Route3: Get Post user details
router.post('/getPostUser',async (req,res)=>{
  try {
       const userId=req.body.postUserId;
      const user= await User.findById(userId).select("-password")
      res.json(user)
      // console.log(user)
  } catch (error) {
      console.error(error.message)
      res.status(500).send({msg:"Internal Server Error"})
  }
})
module.exports=router
