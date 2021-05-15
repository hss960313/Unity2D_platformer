
var lobby = {};
lobby.Login =  (socket)=>{
  socket.join('lobby');

  socket.to('lobby').emit('ANNOUNCE_lobby', `새로운 사용자 ${socket.id} 님이 접속하였습니다.`);

  socket.emit('login_Response', {
    answer : 'OK',
    sid : socket.id
  });
}


lobby.Chat =  (socket, msg)=> {
  socket.to('lobby').emit('lobbyChat_Response', {
    sid : socket.id,
    msg : msg,
    answer : 'ADD'
  });
}
lobby.realTime = (socket)=> {
  let roomList = socket.adapter.rooms;
  let ans, i;
  //console.log("roomList = ",roomList);
  for ( let j in roomList) {
    i++;
  }
  for ( let k in roomList) {
    if ( k == 'lobby') {
      ans = 'OK';

      break;
    }
  }
  if ( ans == undefined )
    ans = 'ERR';
  socket.emit('realTime_lobby_Response', {
    answer : ans,
    list : socket.adapter.rooms['lobby']
  });
}


module.exports = lobby;
