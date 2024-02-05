const fetchuser = require("../middleware/fetchuser");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "mediaBook-2.O";
// const data = jwt.verify(localStorage.getItem("auth-token"), JWT_SECRET);
const onlineUsers =[];
const SocketManager = (server) =>
{
    const socketIO = require("socket.io")
    const io = socketIO(server, {
        cors: {
          origin: "https://media-book-frontend-two.vercel.app", 
          methods: ["GET", "POST"]
        }
      });

    io.on('connection', (socket) => {
        console.log('A user connected',socket.id);
  
    const authToken = socket.handshake.auth.token;
    if (authToken) {
        try {
            const decoded = jwt.verify(authToken, JWT_SECRET);
            const userId = decoded.user.id;
            onlineUsers.push({id:userId,socketId:socket.id})
            // console.log(onlineUsers)
            io.emit('newUser', userId);
        } catch (error) {
            console.error('Error verifying JWT token:', error.message);
        }
    } else {
        console.error('No authentication token provided.');
    }
        socket.on('disconnect', () => {
            console.log('User disconnected');
            const indexToRemove = onlineUsers.findIndex(obj => obj.socketId === socket.id);
            if (indexToRemove !== -1) {
                onlineUsers.splice(indexToRemove, 1);

                // console.log(onlineUsers)
    }
        });
    });
}
module.exports = SocketManager
