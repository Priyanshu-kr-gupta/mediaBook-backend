const express=require('express');
var cors=require('cors')
const app=express();
const port=process.env.port || 5000;
const connectToMongo=require('./dbConnect/db');

app.use(cors());
app.use(express.json());

app.use('/api/auth',require('./routes/auth'));

app.listen(port,()=>{
    console.log(`it is listening at ${port}`);
})

connectToMongo("mongodb://localhost:27017/triallogin");
