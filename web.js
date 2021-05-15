console.log("");
console.log("");
console.log("server on");
console.log("");
console.log("");

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
const universal = require('./SERVER_universalJS');
const TIME = require('./SERVER_TimeJS');

//const serverDB = DB.create(mysql, 'localhost', '3306', 'root', 'sk!@3tkffleh', 'HSS');

const serverDB = DB.create(mysql, '10.0.0.1', '3306', 'node960313', 'sktkffleh!@3', 'node960313');
const GOOD = require('./SERVER_goodJS');
const EVIL = require('./SERVER_evilJS');
DB.connect(serverDB)
  .then(()=>{
    good = new GOOD(DB, serverDB, io);
    evil = new EVIL(DB, serverDB, io);
  });
const COLORS = ['red', 'blue', 'green', 'brown', 'grey', 'orange', 'purple', 'deeppink'];
const ROLES = ['Alpha', 'Beta', 'Chaos','Q','V','Eve','Ruby','Tetto'];

app.use(express.static(__dirname));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/ex/game.html');
});


var socs = [];
var colors = [];
var roles = [];
var userCount = 0;
var fetchCount = {};
var countUsersIn = {};
var timetable = {};
var gameList = {};
var switchingList = {};
var wait_submit = {};
DB.init(serverDB);
io.on('connection', function(socket) {
/*
  socket.on('lobby', (request)=>{
    lobby.server(io, socket, request, userCount);
  });
  socket.on('joinProcess', (request)=>{
    joinProcess.server(io, socket, request, gameList);
  });
  socket.on('inRoom', (request)=>{
    inRoom.server(io, socket, request, gameList);
  });
  socket.on('universal', (request)=>{
    universal.server(io, socket, request, gameList);
  });
  */
  socket.on('good', (request)=>{
    good.skill(socket, request, gameList);
  });
  socket.on('evil', (request)=>{
    evil.skill(socket, request, gameList);
  });
  socket.on('login_Request', () =>  {
    lobby.Login(socket);
    userCount++;
    DB.insert_newSoc(serverDB, `${socket.id}`);
  });

  socket.on('lobbyChat_Request', function(msg) {
    lobby.Chat(socket, msg);
  });

  socket.on('realTime_lobby_Request', () => {
    lobby.realTime(socket);
  });
  socket.on('BACK_beforeGame', (roomName) => {
    inRoom.BACK(socket, roomName);
  });
  socket.on('BACK_gameOver', (roomName)=> {
    inRoom.BACK(socket, roomName);
  });
  socket.on('BACK_COMPLETED', function(roomName) {
    inRoom.BACK_COMPLETED(socket, roomName);
    DB.update_Location(serverDB, 'lobby', socket.id);
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
    joinProcess.JOIN(socket, roomName, io, gameList);
  });

  socket.on('JOIN_COMPLETED', (roomName) => {
    joinProcess.JOIN_COMPLETED(socket, roomName);
    DB.update_Location(serverDB, roomName, socket.id);
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
   DB.delete_Soc(serverDB, `${socket.id}`);
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
    });
  });
  socket.on('start_Request', (roomName)=>{
    //DB.get_SOCPRACTICE(serverDB, roomName, soclist)

    DB.insert_newGame(serverDB, roomName);
    var soclist = [];
    DB.get_socList(serverDB, roomName, soclist)
      .then(()=> {
        DB.start(serverDB, roomName, soclist);
        countUsersIn[roomName] = soclist.length;
        var scr = universal.rand(soclist, COLORS, ROLES);
        socs = scr[0];
        colors = scr[1];
        roles = scr[2];
        //['Alpha', 'Beta', 'Chaos','Q','V','Eve','Ruby','Tetto'];
        for(var k=0; k < soclist.length; k++) {
          DB.update_Role(serverDB, roles[k], socs[k], roomName);
          io.in(socs[k]).emit('start_Response', {
            role: ROLES[k],
            color : colors[k]
          });
        }
        universal.CS_RS(gameList, roomName, fetchCount, socs, colors, roles);
        console.log("start ",gameList[roomName]);
      });
  }); // end of start_Request
  socket.on('gameFETCH_Completed', (roomName)=> {
    fetchCount[roomName] = fetchCount[roomName]+1;
    console.log("fetchCOMPLETED("+roomName+") :"+ fetchCount[roomName]+" countUserIn("+roomName+") = "+countUsersIn[roomName]);
    if ( fetchCount[roomName] == countUsersIn[roomName] ) {
      timetable[roomName] = new TIME();
      var timeflow = setInterval(function() {
        timetable[roomName].setSecond();
        if ( timetable[roomName].getSecond() >= 60 ) {
          timetable[roomName].zeroSecond();
          timetable[roomName].setMinutes();
        }
        io.in(roomName).emit('timeflow', {
          minutes : timetable[roomName].getMinutes().toString().padStart(2, '0'),
          second : timetable[roomName].getSecond().toString().padStart(2, '0')
        });
      }, 1000);
      timetable[roomName+'_flow'] = timeflow;
      switchingList[roomName] = [];
      wait_submit[roomName] = [];
      console.log('server : setting completed');
    }
  });
  //참가자들이 명교리스트에 등록하거나 취소하는경우
  socket.on('nameSwitching_ChangeRequest', async (request)=> {
    var a = await universal.Change(socket, io, switchingList, request);
    var rName = request.rName;
    if ( Object.keys(switchingList[rName]).length == 2) {
      await sleep(2500);
      if ( Object.keys(switchingList[rName]).length == 2 ) {
        //서버에서 클라이언트에 Request함.
        io.to(rName).emit('nameSwitchingOn_Request', {
          list : switchingList[rName]
        });
        switchingList[rName] = [];
      }
    }
  });
  socket.on('gameChat_Request', (request) => {
    universal.Chat(socket, io, request);
  });
  //클라이언트에서 서버에 Response를 보냄. 서버에서 Response를 받으면..
  socket.on('nameSwitchingOn_Response', async (response)=> {
    var a = await universal.switchingOn(socket, io, wait_submit, response);
    var rName = response.rName;
    var obj_length = Object.keys(wait_submit[rName]).length;
    if ( obj_length == 2) {
      io.to(rName).emit('nameSwitching_finally', wait_submit[rName]);
      console.log('switching emit final completed');
      for (let k=10; k > 0; k--) {
        io.to(rName).emit('before_initboard', k);
        var a = await sleep(1000);
        if ( k == 1)
          io.to(rName).emit('initboard', '');
      }
      wait_submit[rName] = [];
    }
  });
  socket.on('go_bystander', (roomName)=> {
    socket.join(roomName+'0000000000bysatander');
  });
}); // end of io.on


function sleep(t){
   return new Promise(function(resolve, reject) {
     setTimeout(()=>{
        resolve(0);
     }, t);
  });
}
process.on('SIGINT', function() {
  DB.end(serverDB);
  console.log("");
  console.log("");
  console.log("server off");
  console.log("");
  console.log("");
  process.exit();
});
