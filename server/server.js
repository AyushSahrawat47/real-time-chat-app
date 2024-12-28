const express = require('express');
const bodyparser = require('body-parser');
const {Server} = require("socket.io");
// const cors = require ('cors'); 

const io = new Server({
    cors: true,
});
const app = express();

app.use(bodyparser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
    console.log("connection was successfully established ")
    socket.on("join-room", (data)=>{
        const {roomId, emailId} = data;
        console.log('User', emailId, 'joined room', roomId);
        emailToSocketMapping.set(emailId, socket.id);
        socketToEmailMapping.set(socket.id, emailId);
        socket.join(roomId);
        socket.emit("joined-room", {roomId});
        socket.broadcast.to(roomId).emit("user-joined", {emailId});
    });
    socket.on("call-user", (data) => {
        console.log('calling user', data);
        const {emailId, offer } = data;
        const fromEmail = socketToEmailMapping.get(socket.id);
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit('incoming-call', {from: fromEmail, offer});
    })
});

app.listen(8000, ()=>{
    console.log('Server is running on port 8000');
})

io.listen(8001, () => {
    console.log('Socket is running on port 8001');
});
