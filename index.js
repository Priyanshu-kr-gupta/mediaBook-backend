  const connectToMongo=require('./dbConnect/db');
const express=require('express');
 const cors=require('cors')
 require("dotenv").config();
 const bodyParser=require("body-parser")

  connectToMongo(process.env.dburl);

  const app=express();
  const port=process.env.port || 5000;

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }))
app.use(express.json())
app.use(
  cors()
);
app.use(cors({
  origin: "https://media-book-frontend-two.vercel.app",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


  const http = require("http")
  const socketIO = require("socket.io")
 
 
 


  const server = http.createServer(app);
  const {SocketManager} = require('./Socket/socketManager')
  const {GlobalChatSocketManager}=require('./Socket/GlobalChatSocketManager')
  SocketManager(server)


  // app.use(cors({
  //   origin: "http://localhost:3000",
  //   methods: ["GET", "POST","PUT"]
  // }));


  app.use('/api/auth',require('./routes/auth'));
  app.use('/api/post',require('./routes/post'));
  app.use('/api/user',require('./routes/user'));

  // app.listen(port,()=>{
  //     console.log(`it is listening at ${port}`);
  // })


  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

