const COLORS = ['red', 'blue', 'green', 'grey', 'orange', 'purple', 'brown', 'deeppink'];
const ROLES= ['알파', '베타', '카오스', '큐', '브이', '이브', '루비' , '테토'];
ClientSoc.on('start_Response', (response)=>{

  realTime_inRoom_STOP();
  console.log("start");
  var r = Id('where').innerHTML;
  var role = response.role;
  var color = response.color;
  fetch_charHTML(role, color)
    .then((resolve)=>{
      Id('inRoom_rName').value = r;
      Id('myColor').value = color;
      Id('icon').setAttribute('style', `background-color : ${color};`);
      Id('switching_cancel').disabled = true;
      Id('game_colorName').innerHTML = IMG(color);
      var oScript = document.createElement('script');
      oScript.type ='text/javascript';
      oScript.charset ='utf-8';
      oScript.src = 'ex/'+role+'.js';
      document.getElementsByTagName('head')[0].appendChild(oScript);
      classAttr('help', 'onMouseEnter', 'helpOn(this.id);');
      classAttr('help', 'onMouseLeave', 'helpOff();');
      classAttr('Skillbutton','onclick', 'clickSkill(this)');
      ClientSoc.emit('gameFETCH_Completed', r);
    });
});

function fetch_charHTML(role, color) {
  return new Promise((resolve, reject) =>{
    fetch('ex/'+role+'HTML').then(function(response){
      response.text().then(function(text) {
        var sid = Id('my_socId').innerHTML;
        Id('body_ALL').innerHTML = text;
        Id('sid').value = sid;
        resolve(0);
      });
    });
  });
}
var isView = false;
function contentView() {
  role = Id('myRole').value;
  isView = !isView;
  if ( isView == true) {
    fetch('ex/'+role+'DETAIL').then(function(response) {
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
  var roles= ['알파', '베타', '카오스', '큐', '브이', '이브', '루비' , '테토'];
  for (let k=0; k < 8; k++) {
    roleradio += `<input type='radio' name='g3' onclick='selectedRole(this.value)' value='${roles[k]}'>${roles[k]}</p>`;
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
}

function IMG(color) {
  return `<img src="colorBox/${color}.jpg" />`;
}
function IMGS(list) {
  var imgs = '';
  for (let k=0; k < list.length; k++)
    if ( k == list.length-1)
      imgs += `<img src="colorBox/${list[k]}.jpg"/>`;
    else
     imgs += `<img src="colorBox/${list[k]}.jpg"/>　|　`;
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
      Id('switching_apply').disabled = true;
      Id('switching_cancel').disabled = false;
      Id('switching_apply').innerText = '이미 대기등록 중입니다..';
  }
  else if ( reason =='Cancel') {
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

function delColor(color) {
  var spl = COLORS.indexOf(color);
  console.log(COLORS.splice(spl,1));
  Id('alive').innerHTML = `현재 생존자(${COLORS.length}) :　`;
  Id('alive').innerHTML += IMGS(COLORS);
}

function clickSkill(e) {
  Id('selectedSkill').value = e.id;
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
  console.log("color", color);
  Id('modal_Color').style.display = 'none';


    Id('selectRole').innerHTML = `선택된 색 : `+IMG(color)+RoleRadio()+`
    <button onclick='closeModal();' style='float : right;'>사용취소</button>
    <button id='submitRole' onclick="onlyRole_Request(${coolTime});" disabled>제출</button>
    `;
Id('modal_Role').style.display = 'block';
}
function ColorRole_Request(coolTime) {
  closeModal();
  skill_emit();
  /*
  ClientSoc.emit('skill_Request', {
    rName : Id('inRoom_rName').value,
    selectedSkill : Id('selectedSkill').value,
    color     : Id('selectedColor').value,
    role      : Id('selectedRole').value
  });
  */
  var eid = Id('selectedSkill').value;
  reUseWait(eid, coolTime);
}

async function reUseWait(eid, coolTime) {
  var reUseCount = Id(eid).value;
  console.log("rw",reUseCount);
  if ( reUseCount == 1) { // 마지막 한번남은경우
      Id(eid).disabled = true;
  }
  else {
    Id(eid).disabled = true;
    for (let k=coolTime; k > 0; k--) {
      var a = await skillCoolTime(eid, k);
    }
    Id(eid).innerText = eid;
    Id(eid).disabled = false;
  }
  if ( reUseCount != 0 && reUseCount != 1)
    Id(eid).value -= 1;
}
function skillCoolTime(eid, value) {
  return new Promise((resolve, reject) => {
      Id(eid).innerText = '재사용('+value+")";
      setTimeout(()=>{
        resolve(0);
      }, 1000);
  });
}
function switching_selectLimit(value) {
  return new Promise((resolve, reject) => {
    Id('switchinglimit').value =""+ `남은 선택시간 : ${value}초`;
    setTimeout(()=> {
      resolve(0);
    },1000);
  });
}
function whom(value) {
  Id('selectedWhom').value = value;
}
function helpOn(id) {
  var offset = Id(id).getBoundingClientRect().top;
  var top;
  if ( id == 'help0') {
    top = offset +26;
    Id('helpDiv').style.left = 150+"px";
  }
  else {
    top = offset + 55;
    Id('helpDiv').style.left = 100+"px";
  }
  Id('helpDiv').style.top = top+"px";
  Id('helpDiv').style.display = "block";
}
function helpOff() {
  Id('helpDiv').style.display = "none";
}
function skill_Prompt(coolTime, announce) {
  Id('modal_Prompt').style.display = 'block';
  Id('typingPrompt').style.width = "800px";
  Id('typingPrompt').innerHTML = ""+announce+`</p><input type="textarea" style="width : 700px; height : 45px;" placeholder="내용을 입력하세요." id="prompt" onkeyDown ="PromptOn();">
  <button id="submitPrompt" style="width : 50px; height : 45px;" onclick ="Prompt_Request(${coolTime});" disabled>제출</button>
  <button onclick="closeModal()" style="float: right; height : 45px;" >취소</button>`;

}
function PromptOn() {
  Id('submitPrompt').disabled = false;
}
function Prompt_Request(coolTime) {
  closeModal();
  console.log("promptText = ", Id('prompt').value);
  skill_emit();
  /*
  ClientSoc.emit('skill_Request', {
    rName : Id('inRoom_rName').value,
    selectedSkill : Id('selectedSkill').value,
    promptText : Id('prompt').value
  });
  */
  reUseWait(Id('selectedSkill').value, coolTime)
}
function skill_onlyColor(coolTime, announce) {
  Id('selectColor').innerHTML = announce+colorRadio() + `
  <button id="submitColor" onclick="onlyColor_Request(${coolTime});" disabled>제출</button>
  <button style="float: right" onclick="closeModal();">취소</button>
  `;
  Id('modal_Color').style.display = 'block';
}


function onlyColor_Request(coolTime) {
  closeModal();
  skill_emit();
  /*
  ClientSoc.emit('skill_Request', {
    rName : Id('inRoom_rName').value,
    selectedSkill : Id('selectedSkill').value,
    color : Id('selectedColor').value
  });
  */
  reUseWait(Id('selectedSkill').value, coolTime);
}
function skill_onlyRole(coolTime, announce) {
  Id('modal_Role').style.display = 'block';
  Id('selectRole').innerHTML = announce+RoleRadio()+`
  <button onclick='closeModal();' style='float : right;'>사용취소</button>
  <button id='submitRole' onclick="onlyRole_Request(${coolTime});" disabled>제출</button>
  `;
}

function onlyRole_Request(coolTime) {
  closeModal();
  skill_emit();
  /*
  ClientSoc.emit('skill_Request', {
    rName : Id('inRoom_rName').value,
    selectedSkill : Id('selectedSkill').value,
    role : Id('selectedRole').value
  });
  */
  reUseWait(Id('selectedSkill').value, coolTime);
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
          console.log("result=", result);
          if ( result == true)
            Id('nameSwitching_left').innerHTML = '상대방을 기다리고 있습니다..';
          ClientSoc.emit('nameSwitchingOn_Response', {
            result : result,
            selectedRole : Id('selectedRole').value,
            rName : Id('inRoom_rName').value,
            color : Id('myColor').value
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
  Id('nameSwitching_right').style.display = 'block';
  if ( Id('isAlive').value == 'true' ) {
    Id('switching_apply').disabled = false;
    Id('switching_apply').innerText = '등록하기';
    Id('switching_cancel').disabled = true;
  }
});
ClientSoc.on('nameSwitching_finally', async function(list) {
  console.log('finally received, list = ', list);
  var colorA = list[0].color;
  var colorB = list[1].color;
  var roleA  = list[0].role;
  var roleB  =  list[1].role;
  //수사관인 경우
  //수사관이 아닌 경우
  //내가 둘중의 하나인경우(내가 신청한경우)
  if ( colorA == Id('myColor').value || colorB == Id('myColor').value) {
    console.log(`${colorA} : 저는 ${roleA}입니다. ${colorB} : 저는 ${roleB} 입니다.`);
    Id('nameSwitching_left').innerHTML = ""+IMG(colorA)+ ` : 저는 ${roleA}입니다.</p>`+IMG(colorB)+` : 저는 ${roleB}입니다.`;

    Id('nameSwitching_left').innerHTML += ""+"<button id='limit' style='position : absolute; left : 600px;'>　</button>";
  }
  else { //내가 두색깔 다 아닌경우(내가 신청하지 않은경우)
    Id('nameSwitching_left').innerHTML = "다른 플레이어들이 이름교환 중입니다...";
  }
  //베타와 이름교환하는경우 자동동맹.
  //1명이상 죽으면 수사권 획득.

});
var isgameover = false;
function deathmodal_Open() {
  if ( isgameover == false) {
    Id('modal_Death').style.display = 'block';
    Id('selectBackorHere').innerHTML = "당신은 죽었습니다. 당신은 관전자가 되어 다른 관전자들과 이 게임을 더 지켜보거나 채팅을 할수 있습니다. 지금부터의 당신의 채팅은 게임의 진행에 아무 영향을 주지 못합니다.<p> 화면 왼쪽 상단에 '로비로 이동' 버튼을 눌러 로비로 나갈수 있습니다.<p> (중요)게임 종료 전에 로비로 이동하는경우 게임에서 패배처리됩니다.<p><button style='float: right; height : 35px;' onclick='closeModal();'>창 닫기</button></p></p>";
    Id('selectBackorHere').style.width = '350px';
    Id('selectBackorHere').style.height = '250px';
    Id('selectBackorHere').style.padding= '15px';
  }
}
async function after5sec() {
  Id('modal_Back').style.display = 'block';
  for (let k =5; k >= 0; k--) {
    Id('BacklobbyAfter5sec').innerHTML = ""+ `<div id='backcount'>　　　${k}</div>(!중요!) 게임이 종료되기 전에 로비로 나가는 경우 게임에서 패배처리됩니다.<p>　</p><button id='blb' style="height : 35px;" onclick='BACK_Request()' disabled>나가기</button>  <button style="float : right; height : 35px;" onclick='closeModal();' >머무르기</button>`;
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
