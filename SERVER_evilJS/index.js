function evil(DB, serverDB, io) {
  this.DB = DB;
  this.server = serverDB;
  this.io = io;
  this.Alpha_failcount = { 'Alpha' : 0, 'Beta' : 0, 'Chaos' : 0,
    'Q' : 0, 'V' : 0, 'Eve' : 0, 'Ruby' : 0, 'Tetto': 0};
}

var proto = evil.prototype;

proto.skill = async function(socket, io, request, gameList) {
  let e = request.eventName;
  let rName = request.rName;
  let colsoc = gameList[rName].colsoc;
  let rolesoc = gameList[rName].rolesoc;
  let colrole = gameList[rName].colrole;
  let isalive = gameList[rName].isAlive;
  let sockets = gameList[rName].sockets;
  let color = request.color;
  let role = request.role;
  if (      e == 'Alpha_1') Alpha_1(socket, io, rName, gameList, color, role, (this.Alpha_failcount));  //심판
  else if ( e == 'Alpha_2') Alpha_2(socket, io, rName, gameList, color, role); //파멸
  else if ( e == 'Beta_1') Beta_1(socket, io, rName, colsoc, colrole, color); //진실의눈
  else if ( e == 'Beta_2') Beta_2(socket, io, rName); //교란
  else if ( e == 'Beta_3') Beta_3(socket, io, rName, sockets, rolesoc, request.prompt); //사칭
  else if ( e == 'Chaos_1') Chaos_1(socket, io, rNmae, colsoc, rolesoc, color, role); // 정체밝히기
  else if ( e == 'Chaos_2') Chaos_2(socket, io, rName, request.prompt) //카오스_방송
  else if ( e == 'ally') ally(socket, io, rName, sockets, colsoc, color); //동맹
  else if ( e == 'broadcast') broadcast_Q(socket, io, rName, request.prompt);  //방송
}

//심판
function Alpha_1(socket, io, rName, gameList, color, role, failcount) {
  io.in(rName).emit('ANNOUNCE', {
    event : '심판',
    color : color
  });
  let ans;
  let colsoc = gameList[rName].colsoc;
  let rolesoc  = gameList[rName].rolesoc;
  let isalive = gameList[rName].isAlive;
  if ( role == 'V') {
    if ( isalive['Q'] == true)
      ans = 'V';
    else {
      ans = 'Qdeath'
    }
  }
  if ( (failcount[role] < 2) || ( (role == 'V') && (ans=='Qdeath') ) ) {
    if ( colsoc[color] == rolesoc[role])
      ans = 'O';
    else {
      ans = 'X';
      failcount[role] += 1;
      if ( failcount[role] >= 2)
        ans = 'BAN';
      var sum =0;
      for ( let i=0; i < failcount.length; i++)
        sum += failcount[i];
      if ( sum >= 4)
        ans = 'death';
      }
    }
  else if ( failcount[role] >= 2) {
        ans = 'BANNED';
      }

  socket.emit('Alpha_1', {
    answer : ans,
    color : color,
    role : role
  });
  if ( ans = 'O')
    death(io, rName, gameList, color);
  else if ( ans = 'death')
    death(io, rName, gameList, mycolor(socket, colsoc));
}
//파멸
function Alpha_2(socket, io, rName, gameList, color, role) {
  io.in(rName).emit('ANNOUNCE', {
    event : '파멸',
    color : color
  });

  let ans = '';
  let isalive = gameList[rName].isAlive;
  let colsoc = gameList[rName].colsoc;
  let rolesoc = gameList[rName].rolesoc;
  if ( role == 'V') {
    if ( isalive['Q'] == true ) {
      ans = 'V';
    }
    else ans = 'Qdeath';
  }
  if ( ans == '' || ans == 'Qdeath') {
    if ( colsoc[color] == rolesoc[role])
      ans = 'O'
    else
      ans = 'X';
  }
    if (ans = 'O')
      death(io, rName, gameList, color);
    socket.emit('Alpha_2', {
      answer : ans,
      color : color,
      role : role
    });
}
//진실의눈
function Beta_1(socket, io, rName, colsoc, colrole, color) {
  io.in(rName).emit('ANNOUNCE', {
    event : '진실의눈',
    color : mycolor(socket, colsoc)
  });
  socket.emit('Beta_1', {
    color : color,
    role : colrole[color]
  });
}
//교란
function Beta_2(socket, io, rName) {
 io.in(rName).emit('ANNOUNCE', {
   event : '교란'
 });
 socket.emit('Beta_2', '');
}
//사칭
function Beta_3(socket, io, rName, sockets, rolesoc, prompt) {
  var i=0;
  for ( var key in rolesoc) {
    if ( key == 'Q') {
      i += 1;
      continue;
    }
    else if ( key != 'Q') {
      sockets[i].emit('ANNOUNCE', {
        event : 'broadcast',
        prompt : prompt,
        role : 'Q'
      });
      i++;
    }
  }
}
//정체밝히기
function Chaos_1(socket, io, rName, colsoc, colrole, color, role) {
  io.in(rName).emit('ANNOUNCE', {
    event : '정체밝히기',
    color : color
  });

  var real_role = colrole[color];
  let ans;
  if ( real_role == role ) {
    ans = 'O';
  }
  else
    ans = 'X';

  socket.emit('Chaos', {
    answer : ans,
    color : color,
    role : role
  });
}
//동맹
function ally(socket, io, rName, sockets, colsoc, color) {
  var sid = colsoc[color];
  var key;
  for (let k=0; k < sockets.length; k++)
    if ( sid == sockets[k].id ) {
      key = sockets[k];
      break;
    }
  key.join(socket.id);
  socket.join(key.id);

  key.emit('ANNOUNCE', {
    event : 'ally',
    color : mycolor(socket, colsoc)
  });
  socket.emit('ANNOUNCE', {
    event : 'ally',
    color : color
  });
}
//카오스_방송
function Chaos_2(socket, io, rName, prompt) {
  io.in(rName).emit('ANNOUNCE', {
    event : 'broadcast',
    prompt : prompt,
    role : 'Chaos'
  });
}
//방송하기
function broadcast_Q(socket, io, rName, prompt) {
  io.in(rName).emit('ANNOUNCE', {
    event : 'broadcast',
    prompt : prompt,
    role : 'Q'
  });
}
//
function sleep(t) {
  return new Promise((resolve, reject)=> {
    setTimeout(()=>{
      resolve(0);
    }, t)
  });
}
//
function mycolor(socket, colsoc) {
  for ( var key in colsoc) {
    if ( colsoc[key] == socket.id ) break;
  }
  return key;
}
//
function find_role(colsoc, rolesoc, color) {
  for ( var key in rolesoc)
    if ( rolesoc[key] == colsoc[color]) break;
  return key;
}
//
function death(io, roomName, gameList, color) {
  var isalive = gameList[roomName].isAlive;
  var rolesoc = gameList[roomName].rolesoc;
  var colsoc = gameList[roomName].colsoc;
  var sockets = gameList[roomName].sockets;
  for (var key in rolesoc)
    if ( rolesoc[key] == colsoc[color]) break;
  isalive[key] = false;

  if ( (key== 'Q') || (key == 'V') || (key == 'EVE') || (key == 'Ruby') || (key == 'Tetto') ) {
    gameList[roomName].victoryCount += 1;

    if ( key == 'Q') {
      for ( var j in sockets) {
        if ( rolesoc['V'] == sockets[j].id) break;
      }
      sockets[j].emit('death_Q', '');
    }
  }
  if ( (key =='Alpha') || (gameList[roomName].victoryCount >= 5 )) {
    clearInterval(gameList[roomName].timeflow);
    var whowin;
    if ( key == 'Alpha')
      whowin = 'good';
    else if (gameList[roomName].victoryCount == 5)
      whowin = 'evil';

    io.in(roomName).emit('gameOver', {
      whowin : whowin,
      colrole : gameList[roomName].colrole
    });
  }

  io.in(roomName).emit('DEATH', {
    color : color,
    announce : `님이 사망하셨습니다.`
  });

} // end of death

module.exports = evil;
