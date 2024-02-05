  const express=require('express');
  const http = require("http")
  const socketIO = require("socket.io")
  require("dotenv").config();
  const cors=require('cors')
  const bodyParser=require("body-parser")
  const app=express();
  const server = http.createServer(app);
  const SocketManager = require('./Socket/socketManager')
  SocketManager(server)
  const port=process.env.port || 5000;
  const connectToMongo=require('./dbConnect/db');
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(express.json({limit: '50mb'}))
  // app.use(cors({
  //   origin: "http://localhost:3000",
  //   methods: ["GET", "POST","PUT"]
  // }));
app.use(cors());
  app.use(express.json());

  app.use('/api/auth',require('./routes/auth'));
  app.use('/api/post',require('./routes/post'));
  app.use('/api/user',require('./routes/user'));

  // app.listen(port,()=>{
  //     console.log(`it is listening at ${port}`);
  // })


  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  connectToMongo(process.env.dburl);
