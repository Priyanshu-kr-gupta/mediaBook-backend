const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String
    },
    bgPhoto:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
});

module.exports=mongoose.model('user',userSchema);
// const UserModel = mongoose.model("user",userSchema);
// export default UserModel
