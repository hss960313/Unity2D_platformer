
var thisSocId;
//hss.cafe24app.com
window.onload = function() {
  fetch('/ex/lobbyHTML').then(function(response) {
    response.text().then(function(text) {
      Id('where').innerHTML = 'lobby';
      Id('BODY').innerHTML = text;
      login_Request();
    })
  });
}
var islobbyupdate = true;
function login_Request() {
  ClientSoc.emit('login_Request', '');
}
ClientSoc.on('login_Response', (response) => {
  switch ( response.answer) {
    case 'OK':
      login_OK(response.sid);
      break;
    case 'ERR':
      login_ERR();
      break;
  }
});

function lobbyChat_Request() {
  if ( Id('lobby_msg').value != '') {
    var li = document.createElement('li');
    li.innerHTML = ""+ Id('lobby_sid').value + '(나) : ' + Id('lobby_msg').value;
    Id('lobby_chat').appendChild(li);
    ClientSoc.emit('lobbyChat_Request', Id('lobby_msg').value
    );
    Id('lobby_msg').value = '';
  }
};

ClientSoc.on('lobbyChat_Response', (response)=> {
  switch (response.answer) {
    case 'ADD':
      lobbyChat_ADD(response);
      break;
    case 'ERR':
      lobbyChat_ERR();
      break;
  }
});
var realTime_lobby;
function realTime_lobby_Request() {
  islobbyupdate = true;
  ClientSoc.emit('realTime_lobby_Request', '');
  realTime_lobby = setInterval(function(){
    ClientSoc.emit('realTime_lobby_Request', '');
  }, 1000);
}

ClientSoc.on('realTime_lobby_Response', function(data) {
    switch ( data.answer) {
      case 'OK':
        realTime_lobby_OK(data.list.sockets);
        break;
      case 'ERR':
        realTime_lobby_ERR();
        break;
    }
});

ClientSoc.on('UserDisconnected', function(sid) {
  var li = document.createElement('li');
  li.innerHTML = `사용자 ${sid} 가 나갔습니다.`;
  Id('lobby_chat').appendChild(li);

  fixBelow('lobby_usersNow');
});

ClientSoc.on('ANNOUNCE_lobby', function(data) {
  var li = document.createElement('li');
  li.innerHTML = data;
  if (Id('lobby_chat') != undefined ) {
    Id('lobby_chat').appendChild(li);

    fixBelow('lobby_chatBox');
}
});


function lobbyChat_ADD(data) {
  var li = document.createElement('li');
  li.innerHTML = ""+ data.sid + ' : ' + data.msg;
  Id('lobby_chat').appendChild(li);
  console.log("from server : "+data.sid+" "+data.msg);

  fixBelow("lobby_chatBox");
};

function lobbyChat_ERR() {
  alert("lobbyChat ERR");

}

function login_OK(sid) {
  Id('my_socId').innerHTML = "나 :  "+sid;
  Id('lobby_sid').value = sid;

  var welcome = document.createElement('li');
  welcome.innerHTML = "접속했습니다. "+sid +"(나)";
  welcome.setAttribute("style", "background-color : #373a3c; color : white;");
  Id('lobby_chat').appendChild(welcome);

  realTime_lobby_Request();
}
function login_ERR() {
  alert("login err");
}

function realTime_lobby_OK(list) {
  console.log("userlist(lobby) received");
  update_userList_lobby(list);
}

function realTime_lobby_ERR() {
  alert('realTime err');
  realTime_lobby_STOP();
}

function realTime_lobby_STOP() {
  clearInterval(realTime_lobby);
  islobbyupdate = false;
}
function createRoomHTML() {
  Id('BODY').style.display = "none";
  Id('ASIDE').style.display = "block";
  fetch('/ex/createRoomHTML').then(function(response) {
    response.text().then(function(text) {
      Id('ASIDE').innerHTML = text;
  })
});
}
function update_userList_lobby(list) {
  if ( islobbyupdate == true) {
    while ( Id('lobby_usersNow').hasChildNodes() ) {
      Id('lobby_usersNow').removeChild(Id('lobby_usersNow').firstChild);
    }
    var i=0;
    for ( var k in list ) {
      i++;
      var li = document.createElement('li');
      li.innerHTML = k;
      Id('lobby_usersNow').appendChild(li);
    }
    Id('lobby_nowUsers').innerHTML = "로비 접속자 : "+i+" 명";
    }
}
