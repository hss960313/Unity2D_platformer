function roomChat_Request() {
  ClientSoc.emit('roomChat_Request', {
    rName : Id('where').innerHTML,
    msg : Id('room_msg').value
  });
  Id('room_msg').value = '';
}

ClientSoc.on('roomChat_Response', (response) => {
  console.log("resan = ", response.answer);
  switch ( response.answer ) {
    case 'OK':
      roomChat_OK(response.sid, response.msg);
      break;
    case 'ERR':
      roomChat_ERR();
      break;

  }
});
function roomChat_OK(sid, msg) {
  var li = document.createElement('li');
  li.innerHTML = sid + ' : ' + msg;
  Id('room_chat').appendChild(li);

  fixBelow("room_chatBox");
}
function roomChat_ERR() {
  console.log('roomChat ERR');
}

ClientSoc.on('ANNOUNCE_room', function(data) {
  var li = document.createElement('li');
  li.innerHTML = data;
  if ( Id('room_chat') != undefined ) {
    Id('room_chat').appendChild(li);
    fixBelow('room_chat');
  }
});
function BACK_Request() {
  ClientSoc.emit('BACK_Request', Id('where').innerHTML);
}

ClientSoc.on('BACK_Response', (answer) => {
  switch ( answer) {
    case 'OK':
      BACK_OK();
    break;
    case 'ERR':
      BACK_ERR();
    break;
  }
});
function BACK_OK(data) {
    fetch_lobbyHTML().then(function(response) {
      realTime_inRoom_STOP();
      ClientSoc.emit("BACK_COMPLETED", Id('where').innerHTML);
      return 0;
    }).then(function(value) {
      Id('where').innerHTML = 'lobby';
      realTime_lobby_Request();
    });
}
function BACK_ERR() {
  alert("BACK ERR");
}

var realTime_inRoom;
function realTime_inRoom_Request() {
  realTime_inRoom = setInterval(function() {
    ClientSoc.emit('realTime_inRoom_Request', Id('where').innerHTML);
  }, 500);
}
ClientSoc.on('realTime_inRoom_Response', (response)=> {
  switch ( response.answer) {
    case 'OK':
      realTime_inRoom_OK(response.list.sockets);
    break;
    case 'ERR':
      realTime_inRoom_ERR();
    break;
  }
});

function realTime_inRoom_OK(soclist) {
  console.log("userList(room) received");
  update_inRoom_userList(soclist);
}

function realTime_inRoom_ERR() {
  clearInterval(realTime_inRoom);
  alert("realTime err");
}

function realTime_inRoom_STOP() {
  clearInterval(realTime_inRoom);
}


var isReady = false;
function READY_Request() {
  isReady = !isReady;
  ClientSoc.emit('ready_Request', isReady);
}
ClientSoc.on('ready_Response', (response) => {
  switch ( response.answer ) {
    case 'OK':
      ready_OK(response.nowready);
    break;
    case 'ERR':
      ready_ERR();
    break;
  }
});
function ready_OK(count) {
  if ( count == 1 )
    Id('playGame').disabled = false; // 보이게
  else
    Id('playGame').disabled = true; // 안보이게
  if ( isReady ) {
    Id('READY').setAttribute("style", "background-color : red");
    Id('READY').innerHTML = 'READY 취소';
  }
  else {
    Id('READY').setAttribute("style", "background-color : default");
    Id('READY').innerHTML = 'READY';
    Id('playGame').disabled = true; // 안보이게
  }
}
function ready_ERR() {
 alert("ready ERR");
}

function update_inRoom_userList(list) {
  while ( Id('room_usersNow').hasChildNodes() ) {
    Id('room_usersNow').removeChild(Id('room_usersNow').firstChild);
  }
  var i=0;
  for ( var k in list ) {
    i++;
    var li = document.createElement('li');
    li.innerHTML = k;
    Id('room_usersNow').appendChild(li);
  }
  Id('room_nowUsers').innerHTML = ""+Id('where').innerHTML+" 접속자 : "+i+" 명";
}

function fetch_lobbyHTML() {
  return new Promise(function(resolve, reject) {
    fetch('/ex/lobbyHTML').then(function(response) {
      response.text().then(function(text) {
        Id('BODY').innerHTML = text;
        Id('lobby_sid').value = Id('my_socId');
        resolve(0);
      })
    });
  });
}
function fetch_startHTML() {
  return new Promise(function(resolve, reject) {
    fetch('/ex/startHTML').then(function(response) {
      response.text().then(function(text) {
        Id('body_ALL').innerHTML = text;
        resolve(0);
      })
    })
  })
}
function playGame() {
  realTime_inRoom_STOP();
  fetch_startHTML();
}
