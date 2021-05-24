
function universal(TIME) {
  this.TIME = TIME;
}

var proto = universal.prototype;


proto.rand = function(soclist, COL, ROLES) {
  var soclist = shuffle(soclist.slice());
  var colors = shuffle(COL.slice());
  var roles = shuffle(ROLES.slice());
  return [soclist, colors, roles];
}
proto.CS_RS = function(gameList, roomName, fetchCount,socs, colors, roles) {
  var colsoc = {};
  var rolesoc = {};
  var colrole = {};
  for (var k=0; k < socs.length; k++) {
    colsoc[colors[k]] = socs[k];
    rolesoc[roles[k]] = socs[k];
    colrole[colors[k]] = roles[k];
  }
  fetchCount[''+roomName] = 0;
  gameList[roomName] = {};
  gameList[''+roomName].colsoc = colsoc;
  gameList[''+roomName].rolesoc = rolesoc;
  gameList[roomName].colrole = colrole;

}
//request : rName, color

proto.Change = function(socket, io, switchingList, request) {
  return new Promise((resolve, reject)=> {
    var rName = request.rName;
    var color = request.color;
    var reason = request.reason;
    if ( reason == 'ADD')
      switchingList[rName].push(color);
    if ( reason == 'Cancel') {
      var spl = switchingList[rName].indexOf(color);
      switchingList[rName].splice(spl,1);
    }
    io.to(rName).emit('waitList_Change', {
      list : switchingList[rName],
      reason : reason,
      changedColor : color
    });
    resolve(0);
  });
}
proto.setting = async function(gameList, io, rName, allsoc) {
  gameList[rName].time = new this.TIME();
  let time = gameList[rName].time;
  let timeflow = setInterval(function() {
    time.setSecond();
    if ( time.getSecond() >= 60 ) {
      time.zeroSecond();
      time.setMinutes();
    }
    io.in(rName).emit('timeflow', {
      minutes : time.getMinutes().toString().padStart(2, '0'),
      second : time.getSecond().toString().padStart(2, '0')
    });
  }, 1000);
  gameList[rName].timeflow = timeflow;
  var a = await SETTING(gameList, io, rName, allsoc);

}

proto.death = async function(io, roomName, color, gameList) {
  var isalive = gameList[roomName].isAlive;
  var rolesoc = gameList[roomName].rolesoc;
  var colsoc = gameList[roomName].colsoc;
  var sockets = gameList[roomName].sockets;
  var a = await sleep(200);
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
    if ( (key == 'V') && (isalive['Q'] == false) ) {
      gameList[roomName].victoryCount +=10;
      io.in(roomName).emit('ANNOUNCE_inGame', {
        color : '',
        announce : `V가 알파를 검거하는데 실패했습니다. 범인측의 승리입니다.`
      });
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

  console.log(" ");
  console.log("uni");
  io.in(roomName).emit('DEATH', {
    color : color,
    announce : `님이 사망하셨습니다.`
  });
  console.log("versal");
  console.log(" ");

}

proto.ANNOUNCE = function(io, rName, color, announce) {
  io.in(rName).emit('ANNOUNCE_inGame', {
    color : color,
    announce : announce
  });
}
proto.Chat = function(socket, io, request) {
  var rName = request.rName;
  var whom = request.whom;
  var msg = request.msg;
  var color = request.color;
  console.log("rNAME", rName);
  switch ( whom ) {
    case '전체':
      io.in(rName).emit('gameChat_All', {
        color : color,
        msg : msg
      });
    break;
    case '동맹':
    io.in(socket.id).emit('gameChat_Ally', {
      color : color,
      msg : msg
    });
    break;
    case '관전자':
    io.in(rName+'0000000000bysatander').emit('gameChat_bystander', {
      color : color,
      msg : msg
    });
    break;
  }
}
proto.switchingOn = async function(socket, io, wait_submit, response, colrole) {
  return new Promise((resolve, reject)=> {
    var rName = response.rName;
    var result = response.result;
    var selectedRole = response.selectedRole;
    var color = response.color;
    //alphabetaE
    //rubyE
    //betaE

    var c_r = {};
    c_r['color'] = color;
    if ( result == true ) {
      c_r['role'] = selectedRole;
      if ( colrole[color] == selectedRole)
        c_r['isTrue'] = '참';
      else {
        c_r['isTrue'] = '거짓';
      }
    }
    else {
      c_r['role'] = '';
      c_r['isTrue'] = '거짓';
    }
    wait_submit[rName].push(c_r);
    resolve(0);
  })
} // end of f:switchingOn

proto.events = function(submitList, rName, gameList, isConfused){
  var events = gameList[rName].events;
  var colrole = gameList[rName].colrole;
  var colorA = submitList[0].color;
  var colorB = submitList[1].color;
  var sockets = gameList[rName].sockets;
  var colsoc = gameList[rName].colsoc;
  console.log("realA ",colrole[colorA]);
  console.log("realB ",colrole[colorB]);
  //
  if ( events.alphabetaE == false) {
    if ( (colrole[colorA] == 'Alpha') && (colrole[colorB] == 'Beta')) {
      whisper(colorA, sockets, colsoc, '베타와 만났습니다. 베타와 자동동맹됩니다.');
      whisper(colorB, sockets, colsoc, '알파와 만났습니다. 알파와 자동동맹됩니다.');
      auto_ally(colorA, colorB, sockets, colsoc);
      events.alphabetaE = true;
    }
    else if ( (colrole[colorA] == 'Beta') && (colrole[colorA] == 'Alpha') ) {
      whisper(colorA, sockets, colsoc, '알파와 만났습니다. 알파와 자동동맹됩니다.');
      whisper(colorB, sockets, colsoc, '베타와 만났습니다. 베타와 자동동맹됩니다.');
      auto_ally(colorA, colorB, sockets, colsoc);
      events.alphabetaE = true;
      }
  }
  //
  if ( events.betaE == false) {
    if ( isConfused == true) {
      if ( colrole[colorA] == 'Beta') {
        if ( colrole[colorB] == 'EVE' || colrole[colorB] == 'V') {
          whisper(colorA, sockets, colsoc, '이브 또는 V와 만났습니다. 자동동맹 됩니다.');
          whisper(colorB, sockets, colsoc, '베타 또는 루비와 만났습니다. 자동동맹 됩니다.');
          auto_ally(colorA, colorB, sockets, colsoc);
          events.betaE = true;
        }
      }
      else if (colrole[colorB] == 'Beta') {
        if ( colrole[colorA] == 'EVE' || colrole[colorA] == 'V') {
          whisper(colorA, sockets, colsoc, '베타 또는 루비와 만났습니다. 자동동맹 됩니다.');
          whisper(colorB, sockets, colsoc, '이브 또는 V와 만났습니다. 자동동맹 됩니다.');
          auto_ally(colorA, colorB, sockets, colsoc);
          events.betaE = true;
        }
      }
    }
  }
  //
  if ( events.rubyE == false) {
    if ( colrole[colorA] == 'Ruby') {
      if ( (colrole[colorB] == 'EVE') || colrole[colorB] == 'V') {
        whisper(colorA, sockets, colsoc, '이브 또는 V와 만났습니다. 자동동맹 됩니다.');
        whisper(colorB, sockets, colsoc, '베타 또는 루비와 만났습니다. 자동동맹 됩니다.');
        auto_ally(colorA, colorB, sockets, colsoc);
        gameList[rName].events.rubyE = true;
      }
    }
    else if ( colrole[colorB] == 'Ruby') {
      if ( colrole[colorA] == 'EVE' || colrole[colorA] == 'V') {
        whisper(colorA, sockets, colsoc, '베타 또는 루비와 만났습니다. 자동동맹 됩니다.');
        whisper(colorB, sockets, colsoc, '이브 또는 V와 만났습니다. 자동동맹 됩니다.');
        auto_ally(colorA, colorB, sockets, colsoc);
        gameList[rName].events.rubyE = true;
      }
    }
  }
} // end of f:events
function auto_ally(colorA, colorB, sockets, colsoc) {

  var sid1 = colsoc[colorA];
  var sid2 = colsoc[colorB];
  for ( var k=0; k < sockets.length; k++) {
    if ( sid1 == sockets[k].id) break;
  }
  for ( var j=0; j < sockets.length; j++) {
    if ( sid2 == sockets[j].id) break;
  }
  sockets[k].join(sockets[j].id);
  sockets[j].join(sockets[k].id);
}

function sleep(t) {
  return new Promise((resolve, reject)=> {
    setTimeout(()=>{
      resolve(0);
    }, t);
  });
}
function whisper(color, sockets, colsoc, announce) {

  var sid = colsoc[color];
  for ( var k=0; k < sockets.length; k++)
    if ( sid == sockets[k].id)
      break;
  sockets[k].emit('switchingE', {
    announce : announce
  });
}
proto.init_ally = async function(socket, soclist, rName) {
  var a = await initally(socket, soclist, rName);
}
function initally(socket, soclist, rName) {
  return new Promise((resolve, reject)=>{
    var sid = socket.id;
    socket.leave(rName+'0000000000bysatander');
    for ( let k=0; k < soclist.length; k++) {
      console.log("leave id=", soclist[k].id);
      if ( sid != soclist[k].id)
        socket.leave(soclist[k].id);
    }
    resolve(0);
  });
}
function shuffle(array) {
  var j, x, i;
  for (i = array.length; i > 0; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = array[i - 1];
    array[i - 1] = array[j];
    array[j] = x;
  }
  return array;
}
function SETTING(gameList, io, rName, allsoc) {
  return new Promise((resolve, reject)=>{

    gameList[rName].isAlive = { 'Alpha' : true, 'Beta' : true, 'Chaos' : true, 'Q' : true, 'V' : true, 'EVE' : true, 'Ruby' : true, 'Tetto' : true};
    gameList[rName].victoryCount = 0;
    gameList[rName].sockets = allsoc[rName];
    gameList[rName].failCounts = { 'Alpha' : 0, 'Beta' : 0, 'Chaos' : 0, 'Q' : 0, 'V' : 0, 'EVE' : 0, 'Ruby' : 0, 'Tetto' : 0};
    var shuffleRole = shuffle(['Beta', 'Chaos', 'EVE', 'Ruby', 'Tetto']);
    gameList[rName].events = {};
    gameList[rName].events.alphabetaE = false;
    gameList[rName].events.betaE = false;
    gameList[rName].events.rubyE = false;
    gameList[rName].events.tettoE = {'Alpha' : shuffleRole[0], 'Q' : shuffleRole[1], 'V': shuffleRole[2]};

    resolve(0);
  });
}
module.exports = universal;
