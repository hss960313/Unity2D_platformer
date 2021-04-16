var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var Home = require('./classex.js');
var io = require('socket.io');

function templateSOCKET() {
  return
}
function templateHTML(title, list, script, body) {
  return `<!doctype html>
  <html>
  <head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
  </head>
  <body>
  <script>${script}</script>
  <h1><a href="/">WEB</a></h1>
  ${list}
  ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
  var list = '<ul>';
  var i=0;
  while (i < filelist.length) {
    list = list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i += 1;
  }
  list += '</ul>';
  return list;
}

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var qd = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log("qd.id = " +qd.id+" pathname = "+pathname);
    if ( pathname == '/') {  //한정된 경로(없는경우, create, create_process, delete, delete_process, Text폴더내 파일)로 들어오는경우
      if ( qd.id == undefined) {      //지정된 경로가 없는경
        fs.readdir('./Text', function(error, filelist) {

          var title = "Welcome!";
          var description = "Hello, Node.js!"
          var list = templateList(filelist);
          var template = templateHTML(title, list, body=description);
          response.writeHead(200);
          response.end(template);
        });
      }
      else { // Text 폴더내 파일로 들어오는 경우.
        var title = qd.id;
        fs.readdir('./Text', function(error, filelist){
          fs.readFile(`Text/${title}`, 'utf8', function(err, description){
            var list = templateList(filelist);
            var template = templateHTML(title, list, body=`
            <a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <h2>${title}</h2>
            <p>${description}</p>
            `);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    }
    else if (pathname == "/create") {
      var title = "WEB-create";
      fs.readdir('./Text', function(error, filelist){
        fs.readFile(`Text/${title}`, 'utf8', function(err, description){
          var list = templateList(filelist);
          var ip_addr = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
          var template = templateHTML(title, list, body=`
          <form action="/create_process" method="post">
          <p><input type="hidden" name="ip" value="${ip_addr}"></p>
            <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
          </form>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
    else if ( pathname == "/create_process") {
      var body = '';
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function() {
        var t2 = new Home(body, response);
        console.log("id = "+ t2.ip);
        console.log("title = "+ t2.title);
        console.log("description = " + t2.description);
      });
      response.end();
    }
    else if(pathname === '/update'){
      fs.readdir('/Text', function(error, filelist){
        fs.readFile(`Text/${qd.id}`, 'utf8', function(err, description){
          var title = qd.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list,body=
          `<a href="/create">create</a>
            <form action="/update_process" method="post">
              <input type="hidden" name="idx" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p><textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p><input type="submit">
              </p>
            </form>`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    } else if(pathname === '/update_process') {
      var body = '';
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`Text/${idx}`, `Text/${title}`, function(error){
          fs.writeFile(`Text/${title}`, description, 'utf8', function(err) {
            // 페이지 리다이렉팅.
            response.writeHead(302, { Location: `/?id=${title}`});
            response.end();
          })
        });
      });
  }
  else {
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);
