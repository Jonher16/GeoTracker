const express = require("express");
const http = require("http");
const app = express();
const port = process.env.PORT || 4001;
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var history = [];
var filteredHistory = [];
io.on("connection", (socket) => {
  var usuario = "";

  socket.on("conectado", (username) => {
    usuario = username;
    console.log(`${usuario} connected`);
    io.emit("mensaje", `${usuario} connected`);
  });

  socket.on("refreshCoordenadas", (username, coordinates) => {
    filteredHistory = history.filter((item) => item.username !== usuario);
    history = filteredHistory;
    filteredHistory = [];
    history.push({ username, coordinates });
    console.log("New History Coordinates => ", history);
    io.emit("coordenadas", history);
  });

  socket.on("disconnect", () => {
    console.log(`${usuario} disconnected`);
    socket.broadcast.emit("mensaje", `${usuario} connected`);
    filteredHistory = history.filter((item) => item.username !== usuario);
    history = filteredHistory;
    filteredHistory = [];
    console.log("history filtered =>", history);
    io.emit("coordenadas", history);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
