import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoute from './routes/UserRoute';
import messageRoute from './routes/MessageRoute';
import socket from "socket.io";
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoute);

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection successfully');
}).catch((err) => {
    console.log('error: ', err.message);
})
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

const onlineUsers = new Map();
const socketOnlineUser = new Map();
io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        socketOnlineUser.set(socket.id, userId);
        socket.broadcast.emit("update-user-status", { userId, online: true });
        console.log("connection: ", onlineUsers);
    });

    socket.on("send-msg", (data) => {
        const receiveUserSocket = onlineUsers.get(data.to);
        if (receiveUserSocket) {
            socket.to(receiveUserSocket).emit("sended-msg", data.msg);
        }
    });

    socket.on("logout", userId => {
        onlineUsers.delete(userId);
        const socketLogoutUser = onlineUsers.get(userId);
        socketOnlineUser.delete(socketLogoutUser);
        socket.emit("update-user-status", { userId, online: false });
    });

    socket.on("disconnect", () => {
        const socketDisconnectUser = socketOnlineUser.get(socket.id);
        onlineUsers.delete(socketDisconnectUser);
        socketOnlineUser.delete(socket.id);
        console.log("disconnection: ", onlineUsers);
        socket.broadcast.emit("update-user-status", { userId: socketDisconnectUser, online: false });
    })
});


export { onlineUsers }