const mongoose=require('mongoose');
const likeSchema= new mongoose.Schema({
    user_id:{
        type:String,
    },
    post_id:{
        type: String,
    }
});

module.exports=mongoose.model('likes',likeSchema);