const mongoose=require('mongoose');
const connectToMongo=async (mongoURI)=>{
    try{
    await mongoose.connect(mongoURI);
        console.log("connected to mongo successfully");
    }
    catch(err){
        console.log(err);
    }
}

module.exports=connectToMongo;