
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
proto.setting = function(gameList, io, rName, allsoc) {
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
  gameList[rName].isAlive = { 'Alpha' : true, 'Beta' : true, 'Chaos' : true, 'Q' : true, 'V' : true, 'EVE' : true, 'Ruby' : true, 'Tetto' : true};
  gameList[rName].victoryCount = 0;
  gameList[rName].sockets = allsoc[rName];
  var shuffleRole = shuffle(['Beta', 'Chaos', 'EVE', 'Ruby', 'Tetto']);
  gameList[rName].tettoE = {'Alpha' : shuffleRole[0], 'Q' : shuffleRole[1], 'V': shuffleRole[2]};
}

proto.death = function(io, roomName, color, gameList) {
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
    var whowin = '';
    if ( key == 'Alpha')
      whowin = 'good';
    else if (gameList[roomName].victoryCount == 5)
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
proto.switchingOn = async function(socket, io, wait_submit, response) {
  return new Promise((resolve, reject)=> {
    rName = response.rName;
    result = response.result;
    selectedRole = response.selectedRole;
    color = response.color;

    var c_r = {};
    c_r['color'] = color;
    if ( result == true )
      c_r['role'] = selectedRole;
    else
      c_r['role'] = '';
    wait_submit[rName].push(c_r);
    resolve(0);
  })
}

proto.init_ally = function(socket, soclist, rName) {
  socket.leave(rName+'0000000000bysatander');
  for ( let k=0; k < soclist.length; k++)
    socket.leave(soclist[k].id);
  socket.join(socket.id);
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

module.exports = universal;
