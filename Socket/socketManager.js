// const fetchuser = require("../middleware/fetchuser");
// const jwt = require("jsonwebtoken");
// const JWT_SECRET = "mediaBook-2.O";
// const data = jwt.verify(localStorage.getItem("auth-token"), JWT_SECRET);
// const onlineUsers =[];
// const onlineUsersId =[];
// const SocketManager = (server) =>
// {
//     const socketIO = require("socket.io")
//     const io = socketIO(server, {
//         cors: {
//           origin: "http://localhost:3000", 
//           methods: ["GET", "POST"]
//         }
//       });

    // io.on('connection', (socket) => {
        // console.log('A user connected',socket.id);
  
    // const authToken = socket.handshake.auth.token;
    // if (authToken) {
        // try {
            // const decoded = jwt.verify(authToken, JWT_SECRET);
            // const userId = decoded.user.id;
            // onlineUsers.push({id:userId,socketId:socket.id})
            // onlineUsersId.push(userId)
            // console.log(onlineUsers)
            
            // io.emit('newUser', onlineUsersId);
        // } catch (error) {
            // console.error('Error verifying JWT token:', error.message);
        // }
    // } else {
        // console.error('No authentication token provided.');
    // }
    // socket.on("logoutUser",()=>{        
    //     const indexToRemove = onlineUsers.findIndex(obj => obj.socketId === socket.id);
    //     if (indexToRemove !== -1) {
    //         onlineUsers.splice(indexToRemove, 1);
    //         onlineUsersId.splice(indexToRemove,1)    
    //         io.emit('newUser', onlineUsersId);
    //     }
    //     })
        // socket.on('disconnect', () => {
            // console.log('User disconnected');
            // const indexToRemove = onlineUsers.findIndex(obj => obj.socketId === socket.id);
            // if (indexToRemove !== -1) {
                // onlineUsers.splice(indexToRemove, 1);
                // onlineUsersId.splice(indexToRemove,1)    
                // console.log(onlineUsers)
                // io.emit('newUser', onlineUsersId);
    // }
        // });







        //global chat socket connections 

        // socket.on()
    // });
// }
// module.exports = SocketManager





const jwt = require("jsonwebtoken");
const socketIO = require("socket.io");
const JWT_SECRET = "mediaBook-2.O";
const onlineUsers = [];
const onlineUsersId = [];

let io; // Declare io outside so it can be accessed globally
let socket; // Declare socket outside so it can be accessed globally
const SocketManager = (server) => {
    io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (sock) => {
        // console.log("A user connected");

        socket = sock; 

        // Handle authentication using JWT
        const authToken = socket.handshake.auth.token;
        // console.log(authToken)
        try {
            const decoded = jwt.verify(authToken, JWT_SECRET);
            const userId = decoded.user.id;
            // console.log(decoded)
            // console.log(userId)
            // onlineUsers.push({ userId, socketId: socket.id });
            // onlineUsersId.push(socket.id);
            socket.on("newChatUser",(room)=>{
                socket.join(room);
                // console.log(`Socket ${userId} joined room ${room}`);
                io.emit("newChatUser",userId);
            })
            socket.on("sendMessage",(room,mes)=>{
                io.to(room).emit("newMessage",{msg:mes,s:0});
            })




        } catch (error) {
            console.error("Authentication failed:", error.message);
            socket.disconnect(true);
        }
    });
};

// Export the io object, SocketManager function, and socket object
module.exports = {
    io,
    SocketManager,
    socket
};
