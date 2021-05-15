var universal = {};

universal.rand = function(soclist, COL, ROLES) {
  var soclist = shuffle(soclist.slice());
  var colors = shuffle(COL.slice());
  var roles = shuffle(ROLES.slice());
  return [soclist, colors, roles];
}
universal.CS_RS = function(gameList, roomName, fetchCount,socs, colors, roles) {
  var colsoc = {};
  var rolesoc = {};
  for (var k=0; k < socs.length; k++) {
    colsoc[colors[k]] = socs[k];
    rolesoc[roles[k]] = socs[k];
  }
  fetchCount[''+roomName] = 0;
  gameList[roomName] = {};
  gameList[''+roomName].colsoc = colsoc;
  gameList[''+roomName].rolesoc = rolesoc;

}
//request : rName, color
universal.Change = function(socket, io, switchingList, request) {
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
universal.death = function(io, roomName, color) {
  io.in(roomName).emit('DEATH', {
    color : color
  });
}
universal.Chat = function(socket, io, request) {
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
universal.switchingOn = async function(socket, io, wait_submit, response) {
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
