const {socket,io} = require('./socketManager')
const GlobalChatSocketManager = () => {
socket.on("newChatUser",(room)=>{
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
    io.emit("newChatUser","connected");
})
};

// Export the io object, SocketManager function, and socket object
module.exports = GlobalChatSocketManager