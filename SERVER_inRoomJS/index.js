var inRoom = {};

inRoom.BACK = (socket, roomName) =>{
  let ans;
  ans = 'OK';

  socket.emit('BACK_Response', {
    answer : ans,
    sid : socket.id
  });
}
inRoom.redirect = function(socket, destination) {
  socket.emit('redirection', {
    redirection : destination
  });
}
inRoom.BACK_COMPLETED = (socket, roomName) =>{
  socket.leave(roomName);
  socket.join('lobby');
  socket.to('lobby').emit('ANNOUNCE_lobby', ` 사용자
  ${socket.id} 님이 로비에 접속했습니다.`);

  socket.to(roomName).emit('ANNOUNCE_room', ` 사용자 ${socket.id} 님이 ${roomName}에서 나갔습니다.`);
}

//broadcast
inRoom.Chat = (socket, data) => {
  var ans;
  if ( data.rName != undefined && data.rName.replace('/', '') == data.rName)
    ans = 'ADD';
  else
    ans = 'ERR';

  socket.to(data.rName).emit('roomChat_Response', {
    sid : socket.id,
    msg : data.msg,
    answer : ans
  });

}

inRoom.realTime = (socket, rName, io) => {
  let ans;
  if ( rName != 'lobby' && rName.replace('/', '') == rName )
    ans = 'OK';
  else
    ans = 'ERR';

  socket.emit('realTime_inRoom_Response', {
    answer : ans,
    list : io.sockets.adapter.rooms[rName]
  });
}
inRoom.ANNOUNCE = (io, rName, announce)=>{
  io.in(rName).emit('ANNOUNCE_inRoom', announce);
}
module.exports = inRoom;
