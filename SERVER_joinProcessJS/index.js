var joinProcess = {};

joinProcess.HTML = (socket) => {
  let roomList = socket.adapter.rooms;
  let i =0, ans;
  for (let k in roomList)
    if ( k.length < 10)
      i++;
  if ( i == 1 )
    ans = 'ERR';
  if ( ans == undefined)
    ans = 'OK';
  socket.emit('joinProcessHTML_Response', ans);
}

joinProcess.JOIN = function(socket, rName, io, gameList) {
  io.in(rName).clients(function(err, clients) {
    let ans;
    if ( clients.length >= 8)
      ans = 'OVER';
    else if ( gameList[rName] != undefined )
      ans = 'LATE';
    else
      ans = 'OK';

    socket.emit('JOIN_Response', {
      answer : ans,
      sid : socket.id,
      rName : rName
    });
  });
}

joinProcess.JOIN_COMPLETED = (socket, roomName) => {
  socket.leave('lobby');
  socket.join(roomName);
  socket.to('lobby').emit('ANNOUNCE_lobby', `사용자 ${socket.id} 님이 로비에서 나갔습니다.`);
  socket.to(roomName).emit('ANNOUNCE_room', ` 사용자 ${socket.id} 님이 ${roomName}에 접속했습니다.`);
}

joinProcess.realTime =  function(socket, io) {
  let roomList1 = io.sockets.adapter.rooms;
  let roomList2 = [];
  let usersNum = [];
  let i =0, j=0;
  let ans;
  for (let k in roomList1)
    if ( k.length < 10) {
      i++;
      roomList2.push(k);
    }
  if ( i == 1 )
    ans = 'ERR';
  else
    ans = 'OK';
  if ( ans == 'OK')
    for (let k in roomList1)
      if ( k.length < 10)
        usersNum.push(io.sockets.adapter.rooms[k].length);

  socket.emit('realTime_roomList_Response', {
    answer : ans,
    list : roomList2,
    NoC : usersNum
  });
}

module.exports = joinProcess;
