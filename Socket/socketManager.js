const jwt = require("jsonwebtoken");
const socketIO = require("socket.io");
const JWT_SECRET = "mediaBook-2.O";
const onlineUsers = [];
const Notification = require("../models/notification")
const User= require('../models/User');

let io; 
let socket; 
const SocketManager = (server) => {

    const notification = async(senderId,recieverId,msg,src)=>{
        if(senderId!==recieverId)
        {

            const noti=new Notification({
                sender:senderId,reciever:recieverId,message:msg,source:src
            })
            const savednoti= await noti.save();
        }
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
            
            socket.on("newuser",(id)=>{
               io.emit("newUser",id);

            })
            
            socket.on("newChatUser",(room)=>{
                socket.join(room);
                io.emit("newChatUser",userId);
            })
            socket.on("sendMessage",(room,mes)=>{
                // console.log(mes)
                io.to(room).emit("newMessage",{msg:mes,s:0});
            })
            socket.on("likeUpdate",(postId,update,rec)=>{
                io.emit("newNotification",rec,userId);
                io.emit("likeUpdate",postId,update,userId);
                if(update==1)
                    notification(userId,rec,"Liked your post",`http://localhost:3000/post/${postId}`);
                else
                    notification(userId,rec,"UnLiked your post",`http://localhost:3000/post/${postId}`);

            })
        



            //notifications

            socket.on("connectionRequest",async (rec)=>{
                notification(userId,rec,"you receive a friend request","http://localhost:3000/search");
                io.emit("newNotification",rec);

            })
            socket.on("acceptConnectionRequest",async (rec)=>{
                notification(userId,rec,userId+" Accepted your request",`http://localhost:3000/user/${userId}`);
                io.emit("newNotification",rec);

            })

            socket.on("newcomment",async (postId,rec)=>{
                notification(userId,rec,"Commented on your post",`http://localhost:3000/post/${postId}`);
                io.emit("newNotification",rec,userId);


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
        
            socket.on("logoutuser", async() => {
               
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
