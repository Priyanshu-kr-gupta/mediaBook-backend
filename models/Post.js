const mongoose=require('mongoose');
const notesSchema= new mongoose.Schema({
    user:{
        type:String,  
    },
    caption:{
        type:String,
    
    },
    postImg:{
        type:String
    },
    likes:{
        type:Number
    },
    date:{
        type:Date,
        default:Date.now
    },

});

module.exports=mongoose.model('post',notesSchema);
