const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const { application } = require("express");

require("dotenv").config();

const app = express();

app.use(cors());
const server = app.listen(process.env.PORT, () => {
  console.log("server is running");
});

const io = socket(server, {
  cors: { origin: "http://localhost:3000", credential: true },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  // global.chatSocket = socket;
  socket.on("addUser", (userId) => {
    console.log(`userId: ${userId}`);
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("onlineUser", onlineUsers);
  });
  socket.on("sendMessage", (data) => {
    console.log("data", data);
    socket.broadcast.emit("message-listener", data);
  });
  socket.on("disconnect", (userId) => {
    onlineUsers.delete(userId);
    socket.broadcast.emit("onlineUser", onlineUsers);
  });
});
