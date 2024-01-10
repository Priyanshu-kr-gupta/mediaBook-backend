const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type: String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
});

module.exports=mongoose.model('tempUser',userSchema);

