var COLORS = ['red', 'blue', 'green', 'grey', 'orange', 'purple', 'brown', 'deeppink'];
var ROLES= ['Alpha', 'Beta', 'Chaos', 'Q', 'V', 'EVE', 'Ruby' , 'Tetto'];
var flowCount = 0;
var hasSUSA = false;
var isView = false;
var whowin = '';
var reUseWaitList = [];
var reUseIntervals = [];
var timeTroubleList = [];
var isConfused = false;
var isgameOver = false;
var isADD = false;
var isDetective = false;

function init_variable() {
  COLORS = ['red', 'blue', 'green', 'grey', 'orange', 'purple', 'brown', 'deeppink'];
  flowCount = 0;
  hasSUSA = false;
  isView = false;
  whowin = ''
  reUseWaitList = [];
  reUseIntervals = [];
  timeTroubleList = [];
  isConfused = false;
  isgameOver = false;
  isADD = false;
  isDetective = false;
}
ClientSoc.on('start_Response', (response)=>{

  init_variable();

  realTime_inRoom_STOP();
  console.log("start");
  var role = response.role;
  var color = response.color;

  fetch_charHTML(role, color, response.sid)
    .then((resolve)=>{
      Id('inRoom_rName').value = response.rName;
      Id('myColor').value = color;
      Id('icon').setAttribute('style', `background-color : ${color};`);
      Id('switching_cancel').disabled = true;
      Id('game_colorName').innerHTML = IMG(color);
      Id('game_colorName').setAttribute('style', `background-color : ${color}`);

      var oScript = document.createElement('script');
      oScript.type ='text/javascript';
      oScript.charset ='utf-8';
      oScript.src = 'ex/'+role+'.js';
      document.getElementsByTagName('head')[0].appendChild(oScript);

      classAttr('help', 'onMouseEnter', 'helpOn(this.id);');
      classAttr('help', 'onMouseLeave', 'helpOff();');
      classAttr('Skillbutton','onclick', 'clickSkill(this)');
      ClientSoc.emit('gameFETCH_Completed', response.rName);
      document.getElementsByTagName('title')[0].innerHTML = Id('myRole').value;
    });
});

function fetch_charHTML(role, color, sid) {
  return new Promise((resolve, reject) =>{
    fetch('ex/'+role+'HTML').then(function(response){
      response.text().then(function(text) {
        Id('body_ALL').innerHTML = text;
        Id('sid').value = sid;
        resolve(0);
      });
    });
  });
}
function contentView() {
  role = Id('myRole').value;
  isView = !isView;
  if ( isView == true) {
    fetch('ex/'+role+'Detail').then(function(response) {
      response.text().then(function(text) {
        Id('detailContent').innerHTML = text;
      })
    })
    Id('detailContent').innerHTML = "";
    Id('detail').innerText = '내용 접기';
  }
  else {
    Id('detailContent').innerHTML = '';
    Id('detail').innerText = '내 역할 자세히 보기';

  }
}
function colorRadio() {
  var colorRadio = '</p>';
  for ( let k=0; k < COLORS.length; k++) {
    colorRadio += `<input type="radio" name="rGroup" onclick="selectedColor(this.value);" value="${COLORS[k]}"><img src="colorBox/${COLORS[k]}.jpg" /></p>`;
  }
  return colorRadio;
}
function selectedColor(color) {
  Id('submitColor').disabled = false;
  Id('selectedColor').value = color;
}
function RoleRadio() {
  var roleradio = '</p>';
  var ROLES =['Alpha', 'Beta', 'Chaos', 'Q', 'V', 'EVE', 'Ruby', 'Tetto'];
  for (let k=0; k < ROLES.length; k++) {
    roleradio += `<input type='radio' name='g3' onclick='selectedRole(this.value)' value='${ROLES[k]}'>${ROLES[k]}</p>`;
  }
  return roleradio;
}
function RoleRadio_Chaos() {
  var roleradio = '</p>';
  var ROLES =['Alpha', 'Beta',  'V',  'Ruby', 'Tetto'];
  for (let k=0; k < ROLES.length; k++) {
    roleradio += `<input type='radio' name='g3' onclick='selectedRole(this.value)' value='${ROLES[k]}'>${ROLES[k]}</p>`;
  }
  return roleradio;
}
function selectedRole(role) {
  Id('submitRole').disabled = false;
  Id('selectedRole').value = role;
}
function closeModal() {
  Id('modal_Color').style.display = "none";
  Id('modal_Role').style.display = "none";
  Id('modal_Prompt').style.display = "none";
  Id('modal_Death').style.display = 'none';
  Id('modal_Back').style.display = 'none';
  Id('modal_gameOver').style.display = 'none';
  abled(Id('selectedSkill').value);
}
function briefing(color, announce) {
  var li = document.createElement('li');
  if ( color != '')
    li.innerHTML = `　!　`+IMG(color)+ "　" +announce;
  else
    li.innerHTML ="　!　"+announce;
  if ( Id('game_chatBox'))
    Id('game_chatBox').appendChild(li);

  fixBelow('game_chatBox');

}
function IMG(color) {
  return `<img src="colorBox/${color}.jpg" align='bottom'/>`;
}
function IMGS(list) {
  var imgs = '';
  for (let k=0; k < list.length; k++)
    if ( k == list.length-1)
      imgs += `<img src="colorBox/${list[k]}.jpg" align='bottom'/>`;
    else
     imgs += `<img src="colorBox/${list[k]}.jpg" align='bottom'/>　|　`;
  return imgs;
}

ClientSoc.on('waitList_Change', (response)=>{
  waitList_Change(response);
});
function waitList_Change(response) {
  var list = response.list;
  var reason = response.reason;

  Id('nameSwitching_left').innerHTML = `이름교환 대기리스트 : </p>`+IMGS(list);

}
function classAttr(cn, attr, html) {
  classes = document.getElementsByClassName(cn);
  for (let k=0; k < classes.length; k++) {
    classes[k].setAttribute(attr, html);
  }
}
function nameSwitching_ChangeRequest(reason) {
  if (reason == 'ADD') {
    skill_disabled();
    isADD = true;
    Id('BacklobbyAfter').disabled = true;
    Id('switching_apply').disabled = true;
    Id('switching_cancel').disabled = false;
    Id('switching_apply').innerText = '이미 대기등록 중입니다..';
  }
  else if ( reason =='Cancel') {
    isADD = false;
    skill_abled();
    Id('BacklobbyAfter').disabled = false;
    Id('switching_apply').disabled = false;
    Id('switching_cancel').disabled = true;
    Id('switching_apply').innerText = '등록하기';

  }
  ClientSoc.emit('nameSwitching_ChangeRequest', {
    reason : reason,
    rName : Id('inRoom_rName').value,
    color : Id('myColor').value
  });
}

ClientSoc.on('disconnected', (response)=>{
  briefing(response.color, response.announce)
});
function delColor(color) {

  var spl = COLORS.indexOf(color);
  if ( spl >= 0)
    COLORS.splice(spl,1);
  Id('alive').innerHTML = `현재 생존자(${COLORS.length}) :　`;
  Id('alive').innerHTML += IMGS(COLORS);
}

function whom(value) {
  Id('selectedWhom').value = value;
}
function gameChat_Request() {
  if ( Id('game_msg').value != '' ) {
    ClientSoc.emit('gameChat_Request', {
      rName : Id('inRoom_rName').value,
      color : Id('myColor').value,
      whom : Id('selectedWhom').value,
      msg : Id('game_msg').value
    });
    if ( (Id('isAlive').value == 'true' ) && (Id('selectedWhom').value == '관전자') ) {
      gameChat('관전', Id('myColor').value, Id('game_msg').value);
    }
    Id('game_msg').value = '';
  }
}

ClientSoc.on('gameChat_All', (response) => {
 var color = response.color;
 var msg = response.msg;
 gameChat('전체', color, msg);
});

ClientSoc.on('gameChat_Ally', (response) => {
  var color = response.color;
  var msg = response.msg;
  gameChat('동맹', color, msg);
});

ClientSoc.on('gameChat_bystander', (response) => {
  var color = response.color;
  var msg = response.msg;
  gameChat('관전', color, msg);
});
function gameChat(whom, color, msg) {
  var li = document.createElement('li');
  li.innerHTML = `[${whom}] `+IMG(color) +` : ${msg}`;
  Id('game_chatBox').appendChild(li);

  fixBelow('game_chatBox');
}

function gameChat_ERR() {
  alert('gameChat ERR');
}

function helpOff() {
  Id('helpDiv').style.display = "none";
}
ClientSoc.on('ANNOUNCE_inGame', (response)=>{
  briefing(response.color, response.announce);
})
ClientSoc.on('ANNOUNCE', (response)=>{
  let e = response.event;
  let color = response.color;
  if ( e == '심판') briefing(color, '님이 상태이상 #에 걸렸습니다.');
  else if ( e == '파멸') briefing(color , '님이 상태이상 #에 걸렸습니다.');
  else if ( e == '정체밝히기') briefing(color , '님이 상태이상 ♣에 걸렸습니다.');
  else if ( e == '감시') briefing(color , '님이 상태이상 ♧에 걸렸습니다.');
  else if ( e == 'arrest') {
    briefing(color , '님이 상태이상 #에 걸렸습니다.');
    if ( response.isArrest == 'O')
      briefing('', '알파가 검거됐습니다. 탐정팀의 승리입니다.');
    else
      briefing(response.failColor, '가 알파를 검거하는데 실패했습니다. '+IMG(response.failColor)+"는 죽을 것입니다.");
  }
  else if ( e == '베타_검거') {
    briefing(color , '님이 상태이상 #에 걸렸습니다.');
    if ( response.isArrest == 'O')
      briefing('', '루비가 베타를 검거했습니다.');
    else
      briefing('','루비가 베타를 검거하는데 실패했습니다. '+IMG(response.rubyColor)+"는 루비입니다.");
  }
  else if ( e == '카오스_검거') {
    briefing(color , '님이 상태이상 #에 걸렸습니다.');
    if ( response.isArrest == 'O')
      briefing('' , '이브가 카오스를 검거했습니다.');
    else
      briefing('', '이브가 카오스를 검거하는데 실패했습니다. 이브는 '+IMG(response.eveColor)+"입니다.");
  }
  else if ( e == '심판의_조각') {
    briefing(color , '님이 상태이상 #에 걸렸습니다.');
    if ( response.answer == 'X')
      briefing('', '이브가 심판에 실패했습니다. 이브는 '+IMG(response.eveColor)+"입니다.");
  }
  else if ( e == '진실의눈') briefing(color , '님이 상태이상 #에 걸렸습니다.');
  else if ( e == 'Q확인') briefing(color , '님이 상태이상 ☆에 걸렸습니다.');
  else if ( e == '이름훔치기') briefing(color , '님이 상태이상 ☆에 걸렸습니다.');
  else if ( e == 'broadcast') broadcast(response.role, response.prompt)
  else if ( e == '교란') confusingOn();
  else if ( e == 'ally') briefing(color, '님과 동맹이 되었습니다.');

});
ClientSoc.on('ally', (response)=>{
  brifefing(response.color, '님과 동맹이 되었습니다.');
});
function broadcast(role, prompt) {
  var li = document.createElement('li');
  li.innerHTML = `　　　　　　　　　　　${role}　:<p>　　　${prompt}`;
  Id('game_chatBox').appendChild(li);

  fixBelow('game_chatBox');
}
function nothing() {
}
function confusingOn() {
  isConfused = true;
  setTimeout(()=>{
    isConfused = false;
  }, 1000*60);
}

function myDEATH() {
  Id('isAlive').value = 'false';
  flowCount = -9999;
  //스킬들 disabled
  Id('BacklobbyAfter').disabled = false;
  skill_disabled();

//대기리스트 등록 , 취소 disabled
  Id('switching_apply').innerText = '등록하기';
  Id('switching_apply').disabled = true;
  Id('switching_cancel').disabled = true;
  //생존자리스트에서 내색깔 제거
  delColor(Id('myColor').value);
  //관전자 채팅만하도록 제한
  Id('toAll').disabled = true;
  Id('toAll').checked = false;
  Id('toAlly').disabled = true;
  Id('toBy').checked = true;
  whom('관전자');
  //죽음창 팝업
  if ( isgameOver == false)
    deathmodal_Open();
  //관전자방으로 이동
  ClientSoc.emit('go_bystander', Id('inRoom_rName').value);
}

function clickSkill(e) {
  Id('selectedSkill').value = e.id;
  Id(e.id).disabled = true;

  skill_Request(e.value);
}

function skill_ColorRole(coolTime, announce) {
  Id('selectColor').innerHTML = ""+announce +colorRadio() + `
    <button id="submitColor" onclick="next(${coolTime});" disabled>다음</button>
    <button style="float: right" onclick="closeModal();">취소</button>
  `;
  Id('modal_Color').style.display = 'block';
}
function next(coolTime) {
  var color = Id('selectedColor').value;
  Id('modal_Color').style.display = 'none';


    Id('selectRole').innerHTML = `선택된 색 : `+IMG(color);
    if ( Id('myRole').value == 'Chaos') {
      Id('selectRole').innerHTML += RoleRadio_Chaos();
    }
    else
      Id('selectRole').innerHTML += RoleRadio();
    Id('selectRole').innerHTML += `<button onclick='closeModal();' style='float : right;'>사용취소</button>
    <button id='submitRole' onclick="reuse_Request(${coolTime});" disabled>제출</button>
    `;
Id('modal_Role').style.display = 'block';
}

function reUseWait(eid, coolTime) {
  if ( Id(eid).value == 0) {
      Id(eid).disabled = true;
  }
  else {
    Id(eid).value = Id(eid).value - 1;
    Id(eid).disabled = true;
    skillCool(eid, coolTime);
  }
}
function skillCool(eid, coolTime) {
  var a = setInterval(()=>{
    if ( Id(eid))
      Id(eid).innerText = '재사용('+coolTime+")";
    if ( coolTime == 0) {
      if ( Id(eid))
        Id(eid).innerText = eid;
      popReuse(eid);
      abled(eid);
      clearInterval(a);
    }
    coolTime--;
  }, 1000);
  reUseIntervals.push(a);
}
function popReuse(eid) {
  var sql = reUseWaitList.indexOf(eid);
  if ( sql >= 0 )
    reUseWaitList.splice(sql,1);
}
function popIntervals() {
  for ( let k=0; k < reUseIntervals.length; k++)
    clearInterval(reUseIntervals[k]);
}
function abled(id) {
  if ( Id(id)) {
    var condition1 = Id(id).value; // 스킬 남은횟수
    var condition2 = reUseWaitList.indexOf(id); // 재사용 스킬리스트에 있는지
    var condition3 = timeTroubleList.indexOf(id); // 시간이벤트에 걸렸는지
    var condition4 = isADD;
    var condition5 = Id('isAlive').value;

    // 남은횟수가 0이 아니고
    // 재사용 스킬리스트에 없고
    // 타임트러블에도 없고
    //내 이름교환이벤트가 아니고
    //내가 살아있을때
    if ( condition1 != 0)
      if ( condition2 < 0)
        if ( condition3 < 0)
          if ( condition4 == false)
            if ( condition5 == 'true')
              Id(id).disabled = false;
  }
}
function skillCoolTime(eid, value) {
  return new Promise((resolve, reject) => {
      if ( Id(eid))
        Id(eid).innerText = '재사용('+value+")";
        var re = setTimeout(()=>{
          resolve(0);
        }, 1000);
    });
}
function switching_selectLimit(value) {
  return new Promise((resolve, reject) => {
    if ( Id('switchinglimit'))
      Id('switchinglimit').value =""+ `남은 선택시간 : ${value}초`;
      setTimeout(()=> {
        resolve(0);
      },1000);
    });
}

function skill_Prompt(coolTime, announce) {
  Id('modal_Prompt').style.display = 'block';
  Id('typingPrompt').style.width = "800px";
  Id('typingPrompt').innerHTML = ""+announce+`</p><input type="textarea" style="width : 700px; height : 45px;" placeholder="내용을 입력하세요." id="prompt" onkeyDown ="PromptOn();">
  <button id="submitPrompt" style="width : 50px; height : 45px;" onclick ="reuse_Request(${coolTime});" disabled>제출</button>
  <button onclick="closeModal()" style="float: right; height : 45px;" >취소</button>`;

}
function PromptOn() {
  Id('submitPrompt').disabled = false;
}

function skill_onlyColor(coolTime, announce) {
  Id('selectColor').innerHTML = announce+colorRadio() + `
  <button id="submitColor" onclick="reuse_Request(${coolTime});" disabled>제출</button>
  <button style="float: right" onclick="closeModal();">취소</button>
  `;
  Id('modal_Color').style.display = 'block';
}

function reuse_Request(coolTime) {
  closeModal();
  skill_emit();
  reUseWaitList.push(Id('selectedSkill').value);
  reUseWait(Id('selectedSkill').value, coolTime)
}

function skill_onlyRole(coolTime, announce) {
  Id('modal_Role').style.display = 'block';
  Id('selectRole').innerHTML = announce+RoleRadio()+`
  <button onclick='closeModal();' style='float : right;'>사용취소</button>
  <button id='submitRole' onclick="reuse_Request(${coolTime});" disabled>제출</button>
  `;
}

function nameSwitching_Initialize() {
  return ""+`
  <div id="nameSwitching_left">이름교환 대기리스트 : </div>`;
}

async function switching_Role() {
  Id('selectRole').innerHTML = '<input type="text" id="switchinglimit">'+RoleRadio()+`
  <button id='submitRole' onclick="closeModal();" disabled>제출</button>
  `;
  Id('modal_Role').style.display = "block";
  for (var k=10; k > 0; k--) {
    var a = await switching_selectLimit(k);
    if ( isRolemodalClosed() == true)
      break;
  }
  closeModal();
  if ( k == 0) return false;
  else return true;
}

function isRolemodalClosed() {
  if ( Id('modal_Role').style.display == "none") return true;
  else return false;
}
//이름교환이 시작됨(두명의 플레이어에게 시간내에 이름을 서버에 제출하게 함)
//두명을 제외한 플레이어들은 제출이 다 완료될때까지 기다림.
ClientSoc.on('nameSwitchingOn_Request', (response)=> {
  Id('nameSwitching_right').style.display = 'none';
  switchingOn(response.list);
});
function switchingOn(list) {
  // 내가 이름을 내야 하는 경우(둘중에 하나가 나인경우)
  for (let k=0; k < list.length; k++) {
    if ( Id('myColor').value == list[k]) {
      Id('nameSwitching_left').innerHTML = '역할을 선택해 주세요.';
      switching_Role()
        .then((result)=> {
          if ( result == true)
            Id('nameSwitching_left').innerHTML = '상대방을 기다리고 있습니다..';
          ClientSoc.emit('nameSwitchingOn_Response', {
            result : result,
            selectedRole : Id('selectedRole').value,
            rName : Id('inRoom_rName').value,
            color : Id('myColor').value,
            isConfused : isConfused
          });
        });
      break;
      }
    // 이름을 내지 않는 경우(둘다 내가 아닌경우)
      if ( k == list.length-1 )
        Id('nameSwitching_left').innerHTML = '다른 플레이어들이 이름교환 중입니다..';
    } // end of for

}
ClientSoc.on('before_initboard', (k)=> {
  Id('limit').innerText =""+ `${k}초 뒤 초기화됩니다.`;
});
ClientSoc.on('initboard', ()=> {
  Id('nameSwitching_left').innerHTML = nameSwitching_Initialize();
  Id('nameSwitching_middle').style.display = 'none';
  Id('nameSwitching_right').style.display = 'block';
  if ( Id('isAlive').value == 'true' ) {
    skill_abled();
    Id('switching_apply').disabled = false;
    Id('switching_apply').innerText = '등록하기';
    Id('switching_cancel').disabled = true;
  }
});
//두명다 이름을 내고 그 결과가 나한테 도착했을때
//내가 그 두명중 하나인경우, 둘다 아닌경우, 수사관인경우, 아닌경우, Q인경우, 아닌경우, 현재 교란상태인지를 확인
//15초 후에 board초기화.
ClientSoc.on('nameSwitching_finally', async function(list) {
  var colorA = list[0].color;
  var colorB = list[1].color;
  var roleA  = list[0].role;
  var roleB  =  list[1].role;

  //내가 둘중의 하나인경우(내가 신청한경우)
  if ( (colorA == Id('myColor').value) || (colorB == Id('myColor').value) ) {
    isADD = false;
    Id('BacklobbyAfter').disabled = false;
    skill_abled();
    console.log(`${colorA} : 저는 ${roleA}입니다. ${colorB} : 저는 ${roleB} 입니다.`);
    Id('nameSwitching_left').innerHTML = ""+IMG(colorA)+ ` : 저는 ${roleA}입니다.</p>`+IMG(colorB)+` : 저는 ${roleB}입니다.`;

    //내가 둘중에 하나이고 수사관인경우
    if ( hasSUSA == true) {
      //교란상태일때 거짓말탐지기가 거짓으로 보임.
      if ( isConfused == true) {
        Id('nameSwitching_middle').innerHTML = ""+`거짓<p>거짓`;
      }
      else { //교란이 아닐시
        Id('nameSwitching_middle').innerHTML = list[0].isTrue +"<p>"+list[1].isTrue;
      }
      Id('nameSwitching_middle').style.display = 'block';
    }
  }
  else { //내가 신청하지 않은경우
    //내가 Q인경우
    if ( isDetective == true) {
      //교란상태일때 거짓말탐지기가 거짓으로 보임.
      Id('nameSwitching_middle').style.display = 'block';
      if ( isConfused == true) {
        Id('nameSwitching_middle').innerHTML = ""+IMG(colorA)+` 거짓<p>`+IMG(colorB)+` 거짓`;
      }
      //교란상태가 아닐경우
      else {
        Id('nameSwitching_middle').innerHTML = ""+IMG(colorA)+" "+list[0].isTrue +"<p>"+IMG(colorB)+" "+list[1].isTrue;
      }
    }
    else { //내가 Q가 아니면
      Id('nameSwitching_left').innerHTML = "다른 플레이어들이 이름교환 중입니다...";
    }
  }

  Id('nameSwitching_left').innerHTML += "<button id='limit' style='position : absolute; left : 600px;'>　</button>";
  //알파와 베타가 이름교환하는경우 자동동맹.
  //교란중에 베타가 V 또는 EVE와 먼저만나면 먼저만난 쪽과만 동맹된다.
  //Ruby는 EVE, V와 먼저만나는 쪽과만 동맹된다.
});

function deathmodal_Open() {
  if ( isgameOver == false) {
    Id('modal_Death').style.display = 'block';
    Id('selectBackorHere').innerHTML = "당신은 죽었습니다. 당신은 관전자가 되어 다른 관전자들과 이 게임을 더 지켜보거나 채팅을 할수 있습니다. 지금부터의 당신의 채팅은 게임의 진행에 아무 영향을 주지 못합니다.<p> 화면 왼쪽 상단에 '로비로 이동' 버튼을 눌러 로비로 나갈수 있습니다.<p> (중요)게임 종료 전에 로비로 이동하는경우 게임에서 패배처리됩니다.<p><button style='float: right; height : 35px;' onclick='closeModal();'>창 닫기</button></p></p>";
    Id('selectBackorHere').style.width = '350px';
    Id('selectBackorHere').style.height = '250px';
    Id('selectBackorHere').style.padding= '15px';
  }
}


function isWin(whowin, myRole) {
  if (whowin == 'evil') {
    if ( myRole == 'Alpha'|| myRole == 'Beta'|| myRole == 'Chaos')
      return true;
    else
      return false;
  }
  else if ( whowin == 'good') {
    if ( myRole == 'Alpha'|| myRole == 'Beta'|| myRole == 'Chaos')
      return false;
    else
      return true;
  }
}
ClientSoc.on('gameOver', (response)=>{
  popIntervals();
  whowin = response.whowin;
  var colrole = response.colrole;
  isgameOver = true;
  skill_disabled();
  if ( Id('show_result'))
    Id('show_result').disabled = false;
  if ( Id('switching_apply'))
    Id('switching_apply').disabled = true;
  if ( Id('switching_cancel'))
    Id('switching_cancel').disabled = true;
  if ( Id('BacklobbyAfter'))
    Id('BacklobbyAfter').disabled = false;
  if ( Id('toAll'))
    Id('toAll').disabled = false;
  if ( Id('toAlly'))
    Id('toAlly').disabled = false;
  infoModal_Open(whowin, colrole);


});
function showResult() {
  Id('modal_gameOver').style.display = 'block';
}
function infoModal_Open(whowin, colrole){
  if ( Id('modal_gameOver')) {
    if ( whowin == 'good')
      Id('Announce_gameOver').innerHTML = "게임이 종료되었습니다.<p> 알파의 검거/사망으로 탐정팀이 이겼습니다.";
    else if ( whowin == 'evil')
      Id('Announce_gameOver').innerHTML = "게임이 종료되었습니다.<p> 알파를 검거/사망시키지 못했으므로 범인팀이 승리합니다.";

    for ( key in colrole) {
      Id('Announce_gameOver').innerHTML += IMG(key) + "의 정체는 "+colrole[key]+"입니다.<p>";
    }

    Id('Announce_gameOver').innerHTML += "<button onclick='closeModal();' style='float : right; height : 30px;'>창 닫기</button><button onclick='BACK2Lobby();' style='float : left; height : 30px;'>로비로 이동</button><p>";

    Id('Announce_gameOver').style.width = '300px';
    Id('Announce_gameOver').style.height = '500px';
    Id('Announce_gameOver').style.padding= '20px';

    Id('modal_gameOver').style.display = 'block';
  }
}
async function BACK2Lobby() {
  var rName = Id('inRoom_rName').value;
  var color = Id('myColor').value;
    popIntervals();
    var isyouwin = '';
    if ( isgameOver == true)
      isyouwin = isWin(whowin, Id('myRole').value);

    initBODY_ALL(rName, Id('sid').value);
    document.getElementsByTagName('head')[0].removeChild(document.getElementsByTagName('head')[0].lastChild);
    var a = await sleep(100);
    ClientSoc.emit('BACK_gameOver', {
      rName : rName,
      isgameOver : isgameOver,
      isWin : isyouwin,
      color : color
    });
}
async function after5sec() {
  Id('modal_Back').style.display = 'block';
  for (let k =5; k >= 0; k--) {
    Id('BacklobbyAfter5sec').innerHTML = ""+ `<div id='backcount'>　　　${k}</div>(!중요!) 게임이 종료되기 전에 로비로 나가는 경우 게임에서 패배처리됩니다.<p>　</p><button id='blb' style="height : 35px;" onclick='BACK2Lobby()' disabled>나가기</button>  <button style="float : right; height : 35px;" onclick='closeModal();' >머무르기</button>`;
    Id('backcount').setAttribute('style', 'font-size : 55px;');
    Id('backcount').style.margin = '25px';
    Id('BacklobbyAfter5sec').style.width = '400px';
    if ( k == 0) {
      Id('blb').disabled = false;
    }
    var a = await sleep(1000);
  }
}

function sleep(t) {
  return new Promise((resolve, reject) => {
    setTimeout(()=> {
      resolve(0);
    }, t);
  });
}
function disabled(eid) {
  if ( Id(eid))
    Id(eid).disabled = true;
}
