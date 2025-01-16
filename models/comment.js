const mongoose = require ("mongoose")
// const moment = require("moment")
const commentSchema = new mongoose.Schema({
    
    post_id:String,
    
    sender:String,
    
    receiver:String,
    
    comment:String,

    date:{
        type:Date,
        default: Date.now
    },
})

module.exports=mongoose.model("comment",commentSchema)