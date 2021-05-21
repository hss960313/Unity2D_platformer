function good(DB, serverDB, io) {
  this.DB = DB;
  this.serverDB = serverDB;
  this.io = io;
};
var proto = good.prototype;



proto.skill = async function(socket, io, request, gameList) {
  var e = request.eventName;
  var rName = request.rName;
  var colsoc = gameList[rName].colsoc;
  var rolesoc = gameList[rName].rolesoc;
  var color = request.color;
  var role = request.role;
  var sockets = gameList[rName].sockets;
  var tettoE = gameList[rName].tettoE;
  if      ( e == 'V_1') V_1(socket, io, rName, colrole, color); //Q확인
  else if ( e == 'V_2') V_2(socket, io, rName, sockets, colsoc, color); //카오스 감시
  else if ( e == 'EVE_1') EVE_1(socket, io, rName, gameList, color); //카오스 검거
  else if ( e == 'EVE_2') EVE_2(socket, io, rName, color, gameList, role); // 심판의 조각
  else if ( e == 'Ruby') Ruby(socket, io, rName, gameList, color); // 베타 검거
  else if ( e == 'Tetto') Tetto(socket, io, rName, colsoc, tettoE); //이름훔치기
  else if ( e == 'ally') ally(socket, io, rName, sockets, colsoc, color); //동맹
  else if ( e == 'arrest') arrest(socket, io, rName, gameList, color); // 알파검거
  else if ( e == 'broadcast') broadcast_Q(socket, io, rName, request.prompt); //방송
}
//Q확인
function V_1(socket, io, rName, colrole, color) {
  io.in(rName).emit('ANNOUNCE', {
    event : 'Q확인',
    color : color
  });
  if ( colrole[color] =='Q')
    ans = 'O';
  else
    ans = 'X';

  socket.emit('V_1', {
    answer : ans,
    color : color
  });
}
//감시
function V_2(socket, io, rName, sockets, colsoc, color) {
  io.in(rName).emit('ANNOUNCE', {
    event : '감시',
    color : color
  });
  var sid = colsoc[color];
  for ( var k=0; k < sockets.length; k++)
    if ( sid == sockets[k].id) break;

  sockets[k].emit('감시', '');

  socket.emit('V_2', {
    color : color
  });

};
//카오스 검거
function EVE_1(socket, io, rName, gameList, color) {
  var colrole = gameList[rName].colrole;
  var isArrest;
  if ( colrole[color] == 'Chaos') {
    isArrest = 'O';
    death(io, rName, color, gameList);
  }
  else {
    isArrest = 'X';
  }

  socket.emit('EVE_1', {
    isArrest : isArrest,
    color : color
  });
  var eveColor = '';
  if ( isArrest == 'X')
    eveColor = mycolor(socket, colsoc);
  io.in(rName).emit('ANNOUNCE', {
    event : '카오스_검거',
    isArrest : isArrest,
    color : color,
    eveColor : eveColor
  });
};
//심판의 조각
function EVE_2(socket, io, rName, color, gameList, role) {
  var colsoc = gameList[rName].colsoc;
  var colrole = gameList[rName].colrole;
  var ans;
  if ( colrole[color] == role) {
    ans = 'O';
    death(io, rName, color, gameList);
  }
  else {
    ans = 'X';
  }
  socket.emit('EVE_2', {
    answer : ans,
    color : color
  });
  var eveColor = '';
  if ( ans == 'X')
    eveColor = mycolor(socket, colsoc);
  io.in(rName).emit('ANNOUNCE', {
    event : '심판의_조각',
    answer : ans,
    color : color,
    eveColor : eveColor
  });
};
//베타_검거
function Ruby(socket, io, rName, gameList, color) {
  var isArrest;
  if ( colrole[color] == 'Beta') {
    isArrest = 'O';
    death(io, rName, color, gameList);
  }
  else {
    isArrest = 'X';
  }
  socket.emit('Ruby', {
    isArrest : isArrest,
    color : color
  });
  var rubyColor = '';
  if ( isArrest == 'X')
    rubyColor = mycolor(socket, colsoc);
  io.in(rName).emit('ANNOUNCE', {
    event : '베타_검거',
    isArrest : isArrest,
    color : color,
    rubyColor : rubyColor
  });

};
//이름훔치기
function Tetto(socket, io, rName, colrole, color, tettoE) {
  io.in(rName).emit('ANNOUNCE', {
    event : '이름훔치기',
    color : color
  });
  var steal = colrole[color];
  if ( (steal == 'Q') || (steal = 'V') || (steal == 'Alpha')) {
    steal = tettoE[steal];
  }

  socket.emit('Tetto', {
    color : color,
    steal : steal
  });
}
//동맹
function ally(socket, io, rName, sockets, colsoc, color) {
  socket.emit('ANNOUNCE', {
    event : 'ally',
    color : color
  });
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
}
//알파검거
async function arrest(socket, io, rName, colrole, color) {
  var isArrest;
  if ( colrole[color] == 'Alpha') {
    isArrest = 'O';
    death(io, rName, color, gameList);
  }
  else {
    isArrest = 'X';
    var a = await sleep(3000);
    death(io, rName, mycolor(socket, colsoc), gameList);
  }
  socket.emit('arrest', {
    isArrest : isArrest,
    color : color
  });
  var failColor = '';
  if ( isArrest == 'X')
    failColor = mycolor(socket, colsoc);
  io.in(rName).emit('ANNOUNCE', {
    event : 'arrest',
    isArrest : isArrest,
    color : color,
    failColor : failColor
  });
}

function broadcast_Q(socket, io, rName, prompt) {
  io.in(rName).emit('ANNOUNCE', {
    event : 'broadcast',
    prompt : prompt,
    role : 'Q'
  });
}

function mycolor(socket, colsoc) {
  for ( var key in colsoc) {
    if ( colsoc[key] == socket.id ) break;
  }
  return key;
}

function death(io, roomName, color, gameList) {
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
    else if (gameList[roomName].victoryCount >= 5)
      whowin = 'evil';

    io.in(roomName).emit('gameOver', {
      whowin : whowin,
      colrole : gameList[roomName].colrole
    });
  }
  else {
    io.in(roomName).emit('DEATH', {
      color : color,
      announce : `님이 사망하셨습니다.`
    });
  }
} // end of func:death
function sleep(t) {
  return new Promise((resolve, reject)=> {
    setTimeout(()=>{
      resolve(0);
    }, t)
  });
}
module.exports = good;
