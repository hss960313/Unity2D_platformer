
function roomChat_Request() {
  if (Id('inRoom_msg').value != '') {
    var li = document.createElement('li');
    li.innerHTML = ""+ Id('inRoom_sid').value + '(나) : ' + Id('inRoom_msg').value;
    Id('inRoom_chat').appendChild(li);

    ClientSoc.emit('roomChat_Request', {
      rName : Id('where').innerHTML,
      msg : Id('room_msg').value
    });
    Id('room_msg').value = '';
  }
}
ClientSoc.on('roomChat_Response', (response) => {
  console.log("resan = ", response.answer);
  switch ( response.answer ) {
    case 'ADD':
      roomChat_ADD(response.sid, response.msg);
      break;
    case 'ERR':
      roomChat_ERR();
      break;

  }
});
function roomChat_ADD(sid, msg) {
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
  if (Id('game_chatBox')) { //게임시작 후 room에 나갔을때
    let rName = Id('inRoom_rName').value;
    initBODY_ALL(rName, Id('sid').value);
    ClientSoc.emit('BACK_gameOver', rName);
  }
  else //게임시작 전에 room에서 나갔을때
    ClientSoc.emit('BACK_beforeGame', Id('where').innerHTML)
}
function initBODY_ALL(rName, sid) {
  Id('body_ALL').innerHTML = ""+`<header id="HEADER">
      <div id="where">${rName}</div>
      <div id="my_socId">나 : ${sid}</div>
    </header>
    <div id ="BODY"></div>
    <aisde id ="ASIDE"></aside>
    <footer id = "FOOTER"></footer>`;
}
ClientSoc.on('BACK_Response', (response) => {
  switch ( response.answer ) {
    case 'OK':
      BACK_OK(response.sid);
    break;
    case 'ERR':
      BACK_ERR();
    break;
  }
});
function BACK_OK(sid) {
    fetch_lobbyHTML().then(function(resolve) {
      realTime_inRoom_STOP();
      ClientSoc.emit("BACK_COMPLETED", Id('where').innerHTML);
      Id('where').innerHTML = 'lobby';
      Id('lobby_sid').value = sid;
      realTime_lobby_Request();
    });
}
function BACK_ERR() {
  alert("BACK ERR");
}
var realTime_inRoom;
var isroomupdate = false;;
function realTime_inRoom_Request() {
  isroomupdate = true;
  ClientSoc.emit('realTime_inRoom_Request', Id('where').innerHTML);
  realTime_inRoom = setInterval(function() {
    if ( Id('where') != undefined )
    ClientSoc.emit('realTime_inRoom_Request', Id('where').innerHTML);
  }, 1000);
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
  isroomupdate = false;
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
  Id('start').disabled = false;
}
/*


function ready_OK(count) {
  if ( count == 1 )
    Id('start').disabled = false; // 보이게
  else
    Id('start').disabled = true; // 안보이게
  if ( isReady ) {
    Id('READY').setAttribute("style", "background-color : red");
    Id('READY').innerHTML = 'READY 취소';
  }
  else {
    Id('READY').setAttribute("style", "background-color : default");
    Id('READY').innerHTML = 'READY';
    Id('start').disabled = true; // 안보이게
  }
}
*/
function ready_ERR() {
 alert("ready ERR");
}

function update_inRoom_userList(list) {
  if ( isroomupdate == true) {
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

function start_Request() {
  ClientSoc.emit('start_Request', Id('where').innerHTML);
}
