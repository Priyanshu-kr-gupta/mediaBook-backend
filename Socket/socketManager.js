const jwt = require("jsonwebtoken");
const socketIO = require("socket.io");
const JWT_SECRET = "mediaBook-2.O";
const onlineUsers = [];
const onlineUsersId = [];
const Notification = require("../models/notification")
const User= require('../models/User');

let io; 
let socket; 
const SocketManager = (server) => {

    const notification = async(senderId,recieverId,msg,src)=>{
        const noti=new Notification({
            sender:senderId,reciever:recieverId,message:msg,source:src
        })
        const savednoti= await noti.save();
    }
    io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", async (sock) => {
        // console.log("A user connected");

        socket = sock; 

        const authToken = socket.handshake.auth.token;
        // console.log(authToken)
        try {
            const decoded = jwt.verify(authToken, JWT_SECRET);
            const userId = decoded.user.id;
           const res= await User.updateOne({_id: userId},{
                $set: {
                  status:"1",
                }
            }
        )
            io.emit("newUser",userId);
            
            socket.on("newChatUser",(room)=>{
                socket.join(room);
                io.emit("newChatUser",userId);
            })
            socket.on("sendMessage",(room,mes)=>{
                io.to(room).emit("newMessage",{msg:mes,s:0});
            })
            socket.on("likeUpdate",(postId,update)=>{
                io.emit("likeUpdate",postId,update,userId);
            })
        



            //notification

            socket.on("connectionRequest",async (rec)=>{
                notification(userId,rec,"you receive a friend request","http://localhost:3000/search");
                io.emit("newNotification",rec);

            })
            socket.on("acceptConnectionRequest",async (rec)=>{
                notification(userId,rec,userId+" Accepted your request",`http://localhost:3000/user/${userId}`);
                io.emit("newNotification",rec);

            })




            socket.on("disconnect", async() => {
                
                const res= await User.updateOne({_id: userId},{
                    $set: {
                        status:"0",
                    }
                }
                )
                io.emit("leaveUser",userId);
            });
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
