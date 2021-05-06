const express = require('express');
const app = express();
const http = require('http').createServer(app).listen(8001);
const io = require('socket.io').listen(http);
const qs = require('querystring');
const mysql = require('mysql');
const DB = require('./DB');
const lobby = require('./SERVER_lobbyJS');
const inRoom = require('./SERVER_inRoomJS');
const joinProcess = require('./SERVER_joinProcessJS');
var serverDB = DB.create(mysql, 'localhost', '3306', 'root', 'sk!@3tkffleh', 'HSS');
//var serverDB = DB.create(mysql, '10.0.0.1', '3306', 'node960313', 'sk!@3tkffleh', 'node960313');
app.use(express.static(__dirname));

app.get('/', function(request, response) {
  //response.sendFile(__dirname + '/index.html');
  response.sendFile(__dirname + '/ex/game.html');
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/ex/game.html');
});


var userCount = 0;
var gameRoom = [];
var res = [];
DB.connect(serverDB);
DB.init(serverDB);
io.on('connection', function(socket) {


  socket.on('login_Request', () =>  {
    lobby.Login(socket);
    userCount++;
    DB.insert(serverDB, `${socket.id}`);
  });

  socket.on('lobbyChat_Request', function(msg) {
    lobby.Chat(socket, msg);
  });

  socket.on('realTime_lobby_Request', () => {
    lobby.realTime(socket);
  });
  socket.on('BACK_Request', (roomName) => {
    inRoom.BACK(socket, roomName)
  });

  socket.on('BACK_COMPLETED', function(roomName) {
    inRoom.BACK_COMPLETED(socket, roomName);
    DB.updateLocation(serverDB, 'lobby', socket.id);
  });

  socket.on('roomChat_Request', function(data) {
    inRoom.Chat(socket, data);
  });

  socket.on('realTime_inRoom_Request', (rName) => {
    inRoom.realTime(socket, rName, io);
  });

  socket.on('joinProcessHTML_Request', ()=> {
    joinProcess.HTML(socket);
  });

  socket.on('JOIN_Request', (roomName) => {
    joinProcess.JOIN(socket, roomName, io);
  });

  socket.on('JOIN_COMPLETED', (roomName) => {
    joinProcess.JOIN_COMPLETED(socket, roomName);
    DB.updateLocation(serverDB, roomName, socket.id);
  });
  socket.on('realTime_roomList_Request', ()=> {
    joinProcess.realTime(socket, io);
  });

  socket.on('createRoom_Request', function(roomName) {
    var rooms = io.sockets.adapter.rooms;
    var ans;
    var rName = roomName.replace('/', '');
    if ( (roomName == '') || roomName == undefined )
      ans = 'ERR';
    else {
      for ( var k in rooms)
        if ( k == rName )
          ans = 'X';
      if ( ans == undefined )
        ans = 'OK';
    }

    socket.emit('createRoom_Response', {
      answer : ans,
      rName : roomName
    });
  });
  socket.on('disconnect', function() {
   console.log(`user ${socket.id} Disconnected`);
   DB.delete(serverDB, `${socket.id}`);
   //socket.disconnect();
   userCount--;
   if ( userCount < 0) {
     userCount = 0;
   }
  });

  socket.on('ready_Request', function(isReady) {
    //DB_updateRDY(socket.id, isReady);

    //let nowreadys = DB_nowReady(data.rName);
    //let ans;
    socket.emit('ready_Response', {
      answer : 'OK',
      nowready : 1
    })
  });
});


process.on('SIGINT', function() {
  DB.end(serverDB);
  console.log("web.js exit");
  process.exit();
});
