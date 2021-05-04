var express = require('express');
var app = express();
var http = require('http').createServer(app).listen(8001);
var io = require('socket.io').listen(http);
var qs = require('querystring');
var mysql = require('mysql');

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
var realTime_userList_lobby;
var realTime_userList_room = [];
var realTime_roomList;

var DB = mysql.createConnection({

  host     : 'localhost',
  user     : 'root',
  password : 'sk!@3tkffleh',
  database : 'HSS'

  /*
  host: "10.0.0.1",
  port : "3306",
  user: "node960313",
  password : "sktkffleh!@3",
  database : "node960313"
  */
});
DB.connect();

function initDB() {
  DB.query('truncate table socList', (error) => {
    if ( error ) {
      DB.query(`CREATE TABLE socList (
        sid VARCHAR(30) PRIMARY KEY,
        rName VARCHAR(20),
        rdy VARCHAR(10),
        isStart VARCHAR(10),
        role VARCHAR(20)
        )`, (error)=> {
        if ( error) console.log( error);
        });
    }
  });
}
function DB_insertSoc(A) {
  DB.query(`INSERT INTO socList VALUES(?, 'lobby', false, false, null)`, [A], (err)=> {
    if ( err)
      console.log(err);
  });
}
function DB_updateRoom(rName, sid) {
  DB.query('UPDATE socList SET rName = ? where sid= ?', [rName, sid], (err) => {
    if ( err )
      console.log(err);
  });
}
function DB_deleteSoc(A) {
  DB.query('DELETE FROM socList where sid= ?',
   [A], (err) => { if (err) console.log(err);
  });
}
initDB();

io.on('connection', function(socket) {
  // 연결되면...

  socket.on('login_Request', function(data) {
    socket.leave(socket.id);
    socket.join('lobby');
    io.in('lobby').emit('ANNOUNCE_lobby', `새로운 사용자 ${socket.id} 님이 접속하였습니다.`);
    userCount++;
    socket.emit('login_Response', {
      answer : 'OK',
      sid : socket.id
    });
    // var s = io.sockets.adapter.sids[`${socket.id}`];
    console.log(`userCount : ${userCount}, sid = ${socket.id} connected`);
    DB_insertSoc(`${socket.id}`);
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
  socket.on('joinProcessHTML_Request', () => {
    let roomList = socket.adapter.rooms;
    let i =0, ans;
    for (let k in roomList)
      i++;
    if ( i == 1 )
      ans = 'ERR';
    if ( ans == undefined)
      ans = 'OK';
    socket.emit('joinProcessHTML_Response', ans);
  });

  socket.on('JOIN_Request', function(rName) {
    io.in(rName).clients(function(err, clients) {
      let ans;
      if ( clients.length == 8 )
        ans = 'ERR';
      else
        ans = 'OK'
      socket.emit('JOIN_Response', {
        answer : ans,
        sid : socket.id,
        rName : rName
      });
    });
  });

  socket.on('JOIN_COMPLETED', function(roomName) {
    socket.join(roomName);
    socket.leave('lobby');
    DB_updateRoom(roomName, socket.id);
    io.in('lobby').emit('ANNOUNCE_lobby', `사용자 ${socket.id} 님이 로비에서 나갔습니다.`);
    io.in(roomName).emit('ANNOUNCE_room', ` 사용자 ${socket.id} 님이 ${roomName}에 접속했습니다.`);
  });

  //ROOM 에서 lobby로 BACK
  socket.on('BACK_Request', function(roomName) {
    let ans;
    ans = 'OK';

    socket.emit('BACK_Response', ans);
  });

  socket.on('BACK_COMPLETED', function(roomName) {
    socket.join('lobby');
    socket.leave(roomName);
    DB_updateRoom('lobby', socket.id);
    io.in('lobby').emit('ANNOUNCE_lobby', ` 사용자
    ${socket.id} 님이 로비에 접속했습니다.`);

    io.in(roomName).emit('ANNOUNCE_room', ` 사용자 ${socket.id} 님이 ${roomName}에서 나갔습니다.`);
});

  socket.on('lobbyChat_Request', function(msg) {
    io.in('lobby').emit('lobbyChat_Response', {
      sid : socket.id,
      msg : msg,
      answer : 'OK'
    });
  });

  //broadcast
  socket.on('roomChat_Request', function(data) {
    var ans;
    if ( data.rName != undefined && data.rName.replace('/', '') == data.rName)
      ans = 'OK';
    else
      ans = 'ERR';
    console.log(ans);
    io.in(data.rName).emit('roomChat_Response', {
      sid : socket.id,
      msg : data.msg,
      answer : ans
    });

  });
   socket.on('realTime_roomList_Request', function(data) {
    let roomList = socket.adapter.rooms;
    let usersNum = [];
    let i =0, j=0, tr;
    let ans;
    for (let k in roomList)
      i++;
    if ( i == 1 )
      ans = 'ERR';
    else
      ans = 'OK';
    if ( ans == 'OK')
      for (let k in roomList)
        usersNum.push(io.sockets.adapter.rooms[k].length);
    socket.emit('realTime_roomList_Response', {
      answer : ans,
      list : roomList,
      NoC : usersNum
    });
});
  socket.on('realTime_lobby_Request', function() {
    let roomList = socket.adapter.rooms;
    let ans, i;
    //console.log("roomList = ",roomList);
    for ( let j in roomList) {
      i++;
    }
    for ( let k in roomList) {
      if ( k == 'lobby') {
        ans = 'OK';

        break;
      }
    }
    if ( ans == undefined )
      ans = 'ERR';
    socket.emit('realTime_lobby_Response', {
      answer : ans,
      list : io.sockets.adapter.rooms['lobby']
    });
  });

socket.on('realTime_inRoom_Request', (rName) => {
  let ans;
  if ( rName != 'lobby' && rName.replace('/', '') == rName )
    ans = 'OK';
  else
    ans = 'ERR';
  socket.emit('realTime_inRoom_Response', {
    answer : ans,
    list : io.sockets.adapter.rooms[rName]
  });
});


  socket.on('forceDisconnect', function() {
   console.log('user forceDisconnected');
   //socket.disconnect();
   userCount--;
   if ( userCount < 0) {
     userCount = 0;
   }
  })

  socket.on('disconnect', function() {
   console.log(`user ${socket.id} Disconnected`);
   DB_deleteSoc(`${socket.id}`);
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
