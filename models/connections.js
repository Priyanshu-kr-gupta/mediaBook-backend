const mongoose = require ("mongoose")
const connectionSchema = new mongoose.Schema({
    
    sender:String,

    receiver:String,

    date:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model("connection",connectionSchema)