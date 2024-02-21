const connectToMongo = require('./dbConnect/db');
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const bodyParser = require("body-parser");

// Database connection
connectToMongo(process.env.dburl);

// Create Express app
const app = express();
const port = process.env.port || 5000;

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(cors());

// Require http and socket.io modules
const http = require("http");
const socketIO = require("socket.io");

// Create http server and socket.io instance
const server = http.createServer(app);
const io = socketIO(server);

// Socket manager
const { SocketManager } = require('./Socket/socketManager');
const { GlobalChatSocketManager } = require('./Socket/GlobalChatSocketManager');
SocketManager(server);

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/post', require('./routes/post'));
app.use('/api/user', require('./routes/user'));

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
