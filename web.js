console.log("");
console.log("server on");
console.log("");
console.log("");
console.log("");

const express = require('express');
const app = express();
const http = require('http');
const qs = require('querystring');
const DB = require('./DB');
const mysql = require('mysql');
var isconn = false;
//var Server = http.createServer(app).listen(8001);
var Server = http.createServer(app).listen(8080);
const io = require('socket.io')(Server);

const conn = DB.LOCALHOST(mysql);
//const conn = DB.CAFE24(mysql);



app.use(express.static(__dirname));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/ex/game.html');
});

app.get('/DBnewCharacter', function (req, res) {
  res.sendFile(__dirname+'/db1.html');
});
app.get('/DBnewAccount', function (req, res) {
  res.sendFile(__dirname+'/db2.html');
});
app.get('/DBdeleteCharacter', function (req, res) {
  res.sendFile(__dirname+'/db3.html');
});
app.get('/DBdeleteAccount', function (req, res) {
  res.sendFile(__dirname+'/db4.html');
});
app.get('/DBgetAccountList', function (req, res) {
  res.sendFile(__dirname+'/db5.html');
});
app.get('/DBgetAllCharacterList', function (req, res) {
  res.sendFile(__dirname+'/db6.html');
});
app.get('/DBgetIdCharacterList', function (req, res) {
  res.sendFile(__dirname+'/db7.html');
});
app.get('/DBcheckLogin', function (req, res) {
  res.sendFile(__dirname+'/db8.html');
});

io.on('connection', (socket)=> {
  if ( isconn == false ) {
    console.log('connected');
    DB.connect(conn);
    isconn = true;
  }
  socket.on('1', (from)=>{
    var res = [];
    DB.newCharacter(conn, from.id , from.cname, from.head,
       from.hair, from.face, from.body, res)
    .then(()=>{
      if ( res[0] == '1')
        socket.emit('1', 'success');
      else
        socket.emit('1', 'fail');
    });
  });
  socket.on('2', (from)=>{
    var res = [];
    DB.newAccount(conn, from.id, from.pwd, res)
    .then(()=>{
      if ( res[0] == '1')
        socket.emit('2', 'success');
      else
        socket.emit('2', 'fail');
    });
 });
  socket.on('3', (from)=>{
    var res = [];
    DB.deleteCharacter(conn, from.id, from.pwd, from.cname, res)
    .then(()=>{
      if ( res[0] == '1')
        socket.emit('3', 'success');
      else
        socket.emit('3', 'fail');
    });
  });

  socket.on('4', (from)=>{
    var res = [];
    DB.deleteAccount(conn, from.id, from.pwd, res)
    .then(()=>{
      if ( res[0] == '1')
        socket.emit('4', 'success');
      else
        socket.emit('4', 'fail');
    });
  });
  socket.on('5', ()=>{
    var toClient5 = [];
    DB.getAccountList(conn, toClient5)
    .then(()=>{
      socket.emit('5', toClient5);
    });
  });
  socket.on('6', ()=>{
    var toClient6 = [];
    DB.getAllCharacterList(conn, toClient6)
    .then(()=>{
      socket.emit('6', toClient6);
    });
  });
  socket.on('7', (id)=>{
    var toClient7 = [];
    var res = [];
    DB.getIdCharacterList(conn, id, toClient7, res)
    .then(()=>{
      socket.emit('7', {
        toClient : toClient7,
        res : res[0]
      });
    });
  });
  socket.on('8', (from)=>{
    var res = [];
    DB.checkLogin(conn, from.id, from.pwd, res)
    .then(()=>{
      if ( res[0] == '1')
        socket.emit('8', 'success');
      else
        socket.emit('8', 'fail');
    });
  });
});
function sleep(t){
   return new Promise(function(resolve, reject) {
     setTimeout(()=>{
        resolve(0);
     }, t);
  });
}
