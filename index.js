var express = require("express");
var app = express();
var server = require("http").createServer(app);
var socket = require("socket.io");
var io = socket(server);
const port = 3000;

var users = new Set();
var votes = [];
var numTotalUsers = 0;

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
//requeting normal link
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
//requesting admin link
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});
//on connection
io.on("connection", (socket) => {
  //adding user to the set
  users.add(socket.id);
  //increasing number of users
  numTotalUsers++;

  console.log(users);
  console.log("number of users:" + numTotalUsers);

  //closing the browser
  socket.on("disconnect", () => {
    users.delete(socket.id);
    numTotalUsers--;
    //console.log(users);
    //console.log("number of users:" + numTotalUsers);
  });

  socket.on("vote", (vote) => {
    votes.push(vote.voted);
    var voteFinish = (numTotalUsers - 1) / votes.length == 1 ? true : false;
    console.log(voteFinish);
    io.emit("voting refresh", { vote: vote.voted, finished: voteFinish });
    console.log(votes);
  });

  //admin functions
  socket.on("Open", (vote) => {
    votes = [];
    io.emit("voting opened");
  });
  socket.on("Closed", (vote) => {
    io.emit("voting closed");
  });
});
