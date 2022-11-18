const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const { application } = require("express");
const Message = require("./models/message");
const mongoose = require("mongoose");

const messageRouter = require("./routes/api/messageRouter");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/chat", messageRouter);

const server = app.listen(process.env.PORT, () => {
  mongoose.connect(process.env.DB_HOST);
  console.log("server is running");
});

const io = socket(server, {
  cors: { origin: "http://localhost:3000", credential: true },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  // global.chatSocket = socket;
  socket.on("addUser", (userId) => {
    // console.log(`userId: ${userId}`);
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("onlineUser", onlineUsers.size);
    console.log('onlineUsers.size', onlineUsers.size)
  });
  socket.on("sendMessage", (data) => {
    // const message = new Message(data);
    // message.save();
    // console.log("data", data);
    socket.broadcast.emit("message-listener", data);
  });
  socket.on("disconnect", (userId) => {
    onlineUsers.delete(userId);
    socket.broadcast.emit("onlineUser", onlineUsers);
  });
});
