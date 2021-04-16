var http = require('http');
var fs = require('fs');
var url = require('url')
var qs = require('querystring')
var io = require('socket.io');
function HomePage() {
 return ``;
};

var app = http.createServer(function(request,response){
    var requestPage = request.url;
    //
    if(requestPage == '/'){
      url = '/index.html';
      console.log("리퀘스트 페이지 : "+requestPage);
    }
    else if ( requestPage == '/ex/scrol.html') {
      url = '/ex/scrol.html';
    }
    else {
      console.log(requestPage);
      response.writeHead(404);
      response.end("page not found");
      return;
    }
    // end of if-requestPage
    response.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
    //console.log("리드 파일 싱크 : "+fs.readFileSync(__dirname + url));
    response.end(fs.readFileSync(__dirname + url));

}); // end of app
app.listen(3000);

var socket = io.listen(app);
socket.sockets.on('connection', function(Socket) {});
