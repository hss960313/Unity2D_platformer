function fetch_inRoomHTML(data) {
  return new Promise(function(resolve, reject) {
    fetch('/ex/inRoomHTML').then(function(response) {
      response.text().then(function(text) {
        Id('BODY').innerHTML = text;
        Id('where').innerHTML = data.rName;
        Id('room_sid').value = data.sid;
        Id('BODY').style.display = "block";
        Id('ASIDE').style.display = "none";
        resolve(0);
      })
    });
  });
}
function fetch_joinProcessHTML() {
  return new Promise(function(resolve, reject) {
    fetch('/ex/joinProcessHTML').then(function(response) {
      response.text().then(function(text) {
        Id('ASIDE').innerHTML = text;
        Id('BODY').style.display = "none";
        Id("ASIDE").style.display = "block";
        resolve(0);
      })
    });
  });
}

function joinProcessHTML_Request() {
  ClientSoc.emit('joinProcessHTML_Request', '');
}

ClientSoc.on('joinProcessHTML_Response', (answer) => {
  switch ( answer) {
    case 'OK':
      joinProcessHTML_OK();
    break;
    case 'ERR':
      joinProcessHTML_ERR();
    break;
  }
});

 function joinProcessHTML_OK() {
  fetch_joinProcessHTML().then(function(resolve) {
    realTime_roomList_Request(resolve);
  });
}

 function joinProcessHTML_ERR() {
  alert("현재 로비 외의 방이 존재하지 않습니다. 새로운 방을 만드세요.");
}
// JOIN 이벤
function JOIN_Request() {
  ClientSoc.emit('JOIN_Request', Id('joinProcess_rName').value);
}

ClientSoc.on('JOIN_Response', (response)=> {
  switch ( response.answer) {
    case 'OK':
      JOIN_OK(response);
    break;
    case 'ERR':
      JOIN_ERR();
    break;
  }
});
function JOIN_OK(data) {
  fetch_inRoomHTML(data).then(function(response) {
    realTime_lobby_STOP();
    realTime_roomList_STOP();
    ClientSoc.emit('JOIN_COMPLETED', data.rName);
    realTime_inRoom_Request(data.rName);
  });
}

function JOIN_ERR() {
  alert("JOIN_ERR");
}
var realTime_roomList;
function realTime_roomList_Request(res) {
  if ( res == 0 )
  realTime_roomList = setInterval(function() {
    ClientSoc.emit('realTime_roomList_Request', '');
  }, 500);
}
ClientSoc.on('realTime_roomList_Response', (response) => {

  switch ( response.answer) {
    case 'OK':
      realTime_roomList_OK(response);
    break;
    case 'ERR':
      realTime_roomList_ERR();
    break;
  }
});
function realTime_roomList_OK(data) {
  console.log('roomList received');
  while ( Id('joinProcess_list').hasChildNodes()) {
    Id('joinProcess_list').removeChild(Id('joinProcess_list').firstChild);
  }
    joinList(data);
}
function realTime_roomList_ERR() {
  alert("real-time 오류입니다. 로비로 이동합니다.");
  toLobby();
}
function realTime_roomList_STOP() {
  clearInterval(realTime_roomList);
}
function joinList(data) {
  var NoC = data.NoC;
  var i=0;
  for ( var k in data.list ) {
    if ( k != 'lobby') {
      var ul = document.createElement('ul');
      ul.innerHTML = k + " : " +NoC[i];

      var add = document.createAttribute("id");
      add.value = "joinProcess_ul";

      ul.setAttributeNode(add);
      ul.onclick = adj_rName;
      //ul.addEventListener("click", JR(k));
      var add2 = document.createAttribute("value");
      add2.value = k;
      ul.setAttributeNode(add2);
      Id('joinProcess_list').appendChild(ul);
    }
    i++;
  }
};
// 방이름을 클릭하면 입장버튼을 보이게함
function adj_rName(e) {
  Id('joinProcess_rName').value = e.target.getAttribute("value");
  Id('toRoom').style.display = "block";
}

// '로비로 이동' 버튼을 클릭하면
function toLobby() {
  realTime_roomList_STOP();
  Cancel();
}
