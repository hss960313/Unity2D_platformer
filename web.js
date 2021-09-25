console.log("");
console.log("server on");
console.log("");
console.log("");

const express = require('express');
const app = express();
const http = require('http');
var plantHttpServer = http.createServer(app).listen(8001);
//const io = require('socket.io')(plantHttpServer);
const qs = require('querystring');
const mysql = require('mysql');

app.use(express.static(__dirname));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/ex/game.html');
});


function sleep(t){
   return new Promise(function(resolve, reject) {
     setTimeout(()=>{
        resolve(0);
     }, t);
  });
}