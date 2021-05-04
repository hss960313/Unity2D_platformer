function createRoom_Clarify() {
  ClientSoc.emit('createRoom_Clarify', Id('createRoom_rName').value);
}
// 동일한 이름이 있는경우
ClientSoc.on('createRoom_NO', function(data) {
  alert(data+"는 이미 있는 방 이름입니다. 다른 이름을 입력해 주세요");
});
// 이름을 안적은경우
ClientSoc.on('createRoom_NULL', function() {
  alert('방 이름을 입력하세요');
});
// 동일한 이름이 없는경우
ClientSoc.on('createRoom_OK', function() {
  alert('생성되었습니다.');

  fetch('/ex/inRoomHTML').then(function(response) {
    rName = Id('createRoom_rName').value;
    response.text().then(function(text) {
      Id('BODY').innerHTML = text;
      Id('inRoom_rName').value = rName;
    })
  });
  ClientSoc.emit('JOIN', rName);
  ClientSoc.emit('real-time_userList_lobby_NO', {});
  ClientSoc.emit('real-time_userList_room_Clarify', {});
});

function Cancel() {
  Id('Container').style.display="none";
  Id('BODY').style.display = "block";
}
