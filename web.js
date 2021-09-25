console.log("server on");
console.log("");
console.log("");

const express = require('express');
const app = express();
const http = require('http');
var plantHttpServer = http.createServer(app).listen(8080);
const io = require('socket.io')(plantHttpServer);
const qs = require('querystring');
const mysql = require('mysql');
const DB = require('./DB');
const lobby = require('./SERVER_lobbyJS');
const inRoom = require('./SERVER_inRoomJS');
const joinProcess = require('./SERVER_joinProcessJS');
const TIME = require('./SERVER_TimeJS');

const UNIVERSAL = require('./SERVER_universalJS');
const serverDB = DB.create(mysql, 'localhost', '3306', 'root', 'sk!@3tkffleh', 'HSS');

//const serverDB = DB.create(mysql, '10.0.0.1', '3306', 'node960313', 'sktkffleh!@3', 'node960313');
const GOOD = require('./SERVER_goodJS');
const EVIL = require('./SERVER_evilJS');
DB.connect(serverDB)
  .then(()=>{
    good = new GOOD(DB, serverDB, io);
    evil = new EVIL(DB, serverDB, io);
    universal = new UNIVERSAL(TIME);
  });
const COLORS = ['red', 'blue', 'green', 'brown', 'grey', 'orange', 'purple', 'deeppink'];
const ROLES = ['Alpha', 'Beta', 'Chaos','Q','V','EVE','Ruby','Tetto'];
//const ROLES = ['Q', 'Beta', 'V', 'Ruby', 'Tetto', 'Chaos', 'EVE', 'Alpha'];
//const ROLES = ['Q', 'Beta', 'V', 'Ruby', 'Tetto', 'EVE', 'Alpha', 'Chaos'];
app.use(express.static(__dirname));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/ex/game.html');
});

var allsoc = {lobby : []};
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
var outUsersIn = {};
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
  good.skill(socket, io, request, gameList);
});

socket.on('evil', (request)=>{
  evil.skill(socket, io, request, gameList);
});

socket.on('login_Request', () =>  {
  lobby.Login(socket);
  userCount++;
  DB.insert_newSoc(serverDB, `${socket.id}`);
  allsoc['lobby'].push(socket);
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

socket.on('BACK_COMPLETED', function(roomName) {
  inRoom.BACK_COMPLETED(socket, roomName);
  DB.update_Location(serverDB, 'lobby', socket.id);
  tLfR(socket.id, roomName);
  var rooms = io.sockets.adapter.rooms;

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
  tRfL(socket.id, roomName);
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
      socs = scr[0].slice();
      colors = scr[1].slice();
      roles = scr[2].slice();
      //['Alpha', 'Beta', 'Chaos','Q','V','Eve','Ruby','Tetto'];
      for(var k=0; k < soclist.length; k++) {
        DB.update_Role(serverDB, roles[k], socs[k], roomName);
        io.in(soclist[k]).emit('start_Response', {
          role: roles[k],
          color : colors[k],
          sid : soclist[k],
          rName : roomName
        });
      }
      //universal.CS_RS(gameList, roomName, fetchCount, socs, colors, roles);
      universal.CS_RS(gameList, roomName, fetchCount, soclist, colors, roles);

    });
}); // end of start_Request
socket.on('gameFETCH_Completed', (roomName)=> {
  fetchCount[roomName] = fetchCount[roomName]+1;
  console.log("fetchCOMPLETED("+roomName+") :"+ fetchCount[roomName]+" countUserIn("+roomName+") = "+countUsersIn[roomName]);
  if ( fetchCount[roomName] == countUsersIn[roomName] ) {
    universal.setting(gameList, io, roomName, allsoc)
    .then(()=>{
      switchingList[roomName] = [];
      wait_submit[roomName] = [];
      outUsersIn[roomName] = 0;
      console.log('server : setting completed');
    });
  }
});
//참가자들이 명교리스트에 등록하거나 취소하는경우
socket.on('nameSwitching_ChangeRequest', async (request)=> {
  var a = await universal.Change(socket, io, switchingList, request);
  var rName = request.rName;
  if ( Object.keys(switchingList[rName]).length == 2) {
    await sleep(2500);
    if ( Object.keys(switchingList[rName]).length == 2 ) {
      if ( gameList[rName].isOn == false) {
        gameList[rName].isOn = true;
        var col1 = switchingList[rName][0];
        var col2 = switchingList[rName][1];
        var colsoc = gameList[rName].colsoc;
        var sockets = gameList[rName].sockets;
        var socA, socB;
        for (var k=0; k < sockets.length; k++) {
          if ( colsoc[col1] == sockets[k].id )
            socA = sockets[k];
          if ( colsoc[col2] == sockets[k].id )
            socB = sockets[k];
        }

        io.in(rName).emit('switching_prepare', {
          list :switchingList[rName]
        });
        switchingList[rName] = [];
        for (var i= 10; i >= 0; i--) {
          socA.emit('before_closeModal', i);
          socB.emit('before_closeModal', i);
          var a = await sleep(1000);
        }
      }
    }
  }
});
socket.on('gameChat_Request', (request) => {
  universal.Chat(socket, io, request);
});
//클라이언트에서 서버에 Response를 보냄. 서버에서 Response를 받으면..
socket.on('nameSwitchingOn_Response', async (response)=> {
  var rName = response.rName;
  var a = await universal.switchingOn(socket, io, wait_submit, response, gameList[rName].colrole);
  var obj_length = Object.keys(wait_submit[rName]).length;
  if ( obj_length == 2) {
    universal.events(wait_submit[rName], rName, gameList, response.isConfused);
    io.to(rName).emit('nameSwitching_finally', wait_submit[rName]);
    for (let k=13; k > 0; k--) {
      io.to(rName).emit('before_initboard', k);
      var a = await sleep(1000);
    }
    io.to(rName).emit('initboard', '');
    gameList[rName].isOn = false;
    wait_submit[rName] = [];
  }
});
socket.on('go_bystander', (roomName)=> {
  socket.join(roomName+'0000000000bysatander');
});

socket.on('disconnect', async function() {
  var sid = socket.id;
  var list = [];
  var a = await DB.getLoca(serverDB, sid, list);
  var rName = list[0].nowLocation;

  if ( rName == 'lobby') {
    lobby.ANNOUNCE(io, `${socket.id} 님이 로비에서 떠났습니다.`);
  }
  else { //로비가 아닌경우
  //게임시작전 떠났을때
  if ( gameList[rName] == undefined) {
    inRoom.ANNOUNCE(io, rName, `${socket.id} 님이 방에서 나갔습니다.`);
  }
  else { //게임시작후 떠났을때
    outUsersIn[rName] = outUsersIn[rName] + 1;
    if (outUsersIn[rName] == countUsersIn[rName]) {
      deleteRname(rName);
    }
    else {
      var colsoc = gameList[rName].colsoc;
      var isalive = gameList[rName].isAlive;
      var colrole = gameList[rName].colrole;
      for ( var keyColor in colsoc) {
        if (sid == colsoc[keyColor]) break;
      }
      var keyRole = colrole[keyColor];
      //살아있는경우 게임에서 제외함.
      if ( isalive[keyRole] == true)
        universal.death(io, rName, keyColor, gameList);
      universal.ANNOUNCE(io, rName, keyColor, '님이 게임에서 떠났습니다.');
    } // delRname이 아닐떄
  } // 게임시작후 떠났을때
} // 로비가 아닌경우
  for (let k=0; k < allsoc[rName].length; k++) {
    if ( sid == allsoc[rName][k].id) {
      allsoc[rName].splice(k, 1);
      break;
    }
  }
  DB.delete_Soc(serverDB, `${socket.id}`);
  userCount--;
  if ( userCount < 0) {
    userCount = 0;
  }
});
socket.on('BACK_gameOver', (response)=> {
  inRoom.redirect(socket, '/game');
});
}); // end of io.on
//
//


function sleep(t){
   return new Promise(function(resolve, reject) {
     setTimeout(()=>{
        resolve(0);
     }, t);
  });
}
function deleteRname(rName) {
  clearInterval(gameList[rName].timeflow);
  delete gameList[rName];
}
function tRfL(sid, rname) {
  var soclist_l = allsoc['lobby'];
  var soc;
  for ( var k=0;  k < soclist_l.length; k++) {
    if ( sid == soclist_l[k].id) {
      soc = soclist_l[k];
      break;
    }
  }
    allsoc['lobby'].splice(k, 1);
    if ( allsoc[rname] == undefined )
      allsoc[rname] = [];
    allsoc[rname].push(soc);
}
function tLfR(sid, rname) {
  var soclist_r = allsoc[rname];
  var soc;
  for ( var k=0;  k < soclist_r.length; k++) {
    if ( sid == soclist_r[k].id) {
      soc = soclist_r[k];
      break;
    }
  }
  allsoc[rname].splice(k, 1);
  if ( allsoc['lobby'] == undefined )
    allsoc['lobby'] = [];
  allsoc['lobby'].push(soc);
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
