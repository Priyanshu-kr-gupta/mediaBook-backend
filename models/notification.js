const mongoose=require('mongoose');
const notificationSchema= new mongoose.Schema({
    sender:{
        type:String,  
    },
    reciever:{
        type:String,
    
    },
    message:{
        type:String,
    },
    source:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    },

});

module.exports=mongoose.model('notification',notificationSchema);
