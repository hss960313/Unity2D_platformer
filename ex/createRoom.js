function createRoom_Request() {
  ClientSoc.emit('createRoom_Request', Id('createRoom_rName').value);
}

ClientSoc.on('createRoom_Response', (response) => {
  switch ( response.answer ) {
    case 'OK':
      createRoom_OK(response.rName);
      break;
    case 'ERR':
      createRoom_ERR();
      break;
    case 'X':
      createRoom_X(response.rName);
      break;
  }
});

function createRoom_OK(rName) {
  alert("방이 생성되었습니다.");
  ClientSoc.emit('JOIN_Request', rName);
}

function createRoom_X(rName) {
  alert(rName+"는 이미 있는 방 이름입니다. 다른 이름을 입력해 주세요");
}

function createRoom_ERR() {
  alert('방 이름을 입력하세요');
}

function Cancel() {
  Id('ASIDE').style.display="none";
  Id('BODY').style.display = "block";
}
