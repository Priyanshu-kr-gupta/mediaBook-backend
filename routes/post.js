const express=require('express');
const router=express.Router();
const User= require('../models/User');
const fetchuser=require('../middleware/fetchuser')
const Post=require('../models/Post')
const Likes=require("../models/Likes")

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


//like post
router.post('/likePost', async (req, res) => {
  const { postId, userId } = req.body;

  try {
      const existingLike = await Likes.findOne({ post_id: postId, user_id: userId });

      if (!existingLike) {
          // If the user hasn't liked the post, insert the like
          await Likes.create({ post_id: postId, user_id: userId });
      } else {
          // If the user has already liked the post, delete the like
          await Likes.deleteOne({ post_id: postId, user_id: userId });
      }

      res.send({ success: true});
  } catch (err) {
      console.error('Error handling like/unlike:', err);
      res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/getLikesCount/:postId', async (req, res) => {
  const postId = req.params.postId;
const userid = req.body.userId;
  try {
      const likeCount = await Likes.countDocuments({ post_id: postId });
      const st=await Likes.find({ post_id: postId, user_id:userid });
      res.json({likeCount,status:st.length} );
  } catch (err) {
      console.error('Error getting like count:', err);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});


module.exports=router
