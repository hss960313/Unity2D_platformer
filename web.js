var express = require('express');
var app = express();
var http = require('http').createServer(app).listen(3000);
var io = require('socket.io').listen(http);
var qs = require('querystring');
var userCount = 0;
app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get('/lobby', function(req, res) {
  res.sendFile(__dirname + '/ex/scrol.html'); 
});
app.get('/MR', function(req, res) {
  res.sendFile(__dirname + '/ex/room.html');
});
app.post('/lobby', function(req, res) {

  var body='';
  req.on('data', function(data) {
    body += data;
  })
  req.on('end', function() {
    var post = qs.parse(body);
    res.sendFile(__dirname + `/ex/room.html`);
    console.log("success")
  });
});
var gameRoom = {};


io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('login', function(data) {
    userCount++;
    io.emit('login', `user_${userCount}`);
  });

  socket.on('CR_clarify', function(roomName) {
    var roomsOld = io.sockets.adapter.rooms;
    var name = roomName.replace('/', '');
    console.log("roomlist before= "+ roomsOld);
    for ( var k in roomsOld) {
      if ( k == name) {
        console.log('roomNmae error');
        io.emit('SameName', name);
        return 0;
      }
    }
    io.emit('noErrorinCR', {});
  });

  socket.on('createRoom', function(roomName) {
    var name = roomName.replace('/', '');
    socket.join(name);
    var roomsNew = socket.adapter.rooms;
    console.log("roomlist after = "+ roomsNew);
    for ( var k in roomsNew) {
      console.log("new : " + k);
    }
  });

  socket.on('JR', function(roomName) {
    var roomName = data.roomName.replace('/', '');
    socket.join(roomName);
    io.in(roomName).emit('ANNOUNCE', '');
    console.log("JR : "+ io.manager.rooms);
  });

  socket.on('chat_lobby', function(data) {
    console.log('Message received : '+ data.name +" , "+ data.msg);
    socket.broadcast.emit('chat_lobby', data);
  });

   socket.on('forceDisconnect', function() {
     console.log('user forceDisconnected');
     socket.disconnect();
     //userCount--;
     if ( userCount < 0) {
       userCount = 0;
     }
   })

   socket.on('disconnect', function() {
     console.log('user disconnected');
     socket.disconnect();
     //userCount--;
     if ( userCount < 0) {
       userCount = 0;
     }
     io.emit('UserDisconnected', userCount);

   });
});
