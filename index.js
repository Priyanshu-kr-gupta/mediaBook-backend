const express=require('express');
var cors=require('cors')
const bodyParser=require("body-parser")
const app=express();
const port=process.env.port || 5000;
const connectToMongo=require('./dbConnect/db');
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}))
app.use(cors());
app.use(express.json());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/post',require('./routes/post'));
app.use('/api/user',require('./routes/user'));

app.listen(port,()=>{
    console.log(`it is listening at ${port}`);
})

connectToMongo("mongodb://localhost:27017/triallogin");
