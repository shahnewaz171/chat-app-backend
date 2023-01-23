const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const expressServer = http.createServer(app);
const { Server } = require("socket.io");
require("dotenv").config();

const port = 5000;
app.use(cors());

const io = new Server(expressServer, {
  cors: {
    origin: "https://socketreact-chat-app.netlify.app",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("create_room", (data) => {
    socket.join(data);
    console.log(`User ID: ${socket.id} and created room: ${data}`);
  });
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    if (data.room !== null) {
      socket.to(data.room).emit("received_message", data);
    } else if (data.pathname !== null) {
      socket.to(data.pathname).emit("received_message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

expressServer.listen(process.env.PORT || port);
