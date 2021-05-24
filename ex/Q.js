//시간이벤트는 개인에따라 다를수도 있다.
hasSUSA = true;
isDetective = true;
ClientSoc.on('timeflow', (response) => {
  if ( Id('timeflow')) {
    Id('timeflow').innerHTML = ""+ response.minutes + " : "+ response.second;
  }
  flowCount++;
  if (flowCount == 60*35) {
      BACK2Lobby();
  }
});

ClientSoc.on('DEATH', (death) =>{
  if ( Id('myColor')) {
    if ( death.color == Id('myColor').value )
      myDEATH();
    else
      delColor(death.color);
    briefing(death.color, death.announce);
  }
});

function skill_Request() {
  if ( Id(Id('selectedSkill').value).disabled == true) {
  switch ( Id('selectedSkill').value ) {
    case '알파검거':
      skill_onlyColor(0, '범인을 검거합니다.');
      break;
    case '동맹하기':
      skill_onlyColor(3, '동맹하기');
      break;
    case '방송하기':
      skill_Prompt(120, 'Q의 이름으로 방송합니다.');
      break;
  }
}
}
function skill_emit() {
    let e =  Id('selectedSkill').value;
    let eName;
    let prompt = '';
    if ( Id('prompt'))
      prompt = Id('prompt').value;
    if ( e == '알파검거') eName = 'arrest';
    else if ( e == '동맹하기') eName = 'ally';
    else if ( e == '방송하기') eName = 'broadcast';
    ClientSoc.emit('good', {
      eventName : eName,
      rName : Id('inRoom_rName').value,
      color : Id('selectedColor').value,
      prompt : prompt
    });

}
ClientSoc.on('arrest', (response)=>{
  if ( response.isArrest == 'O') {
    briefing('', '알파를 검거했습니다. 당신의 승리입니다.');
  }
});

function skill_disabled() {
  disabled('알파검거');
  disabled('동맹하기');
  disabled('방송하기');
}
function skill_abled() {
  abled('알파검거');
  abled('동맹하기');
  abled('방송하기');
}
function helpOn(id) {
  var offset = Id(id).getBoundingClientRect().top;
  var top;
  if ( id == 'help0') {
    top = offset +26;
    Id('helpDiv').style.left = 150+"px";
    Id('helpDiv').innerHTML = ""+`게임이 끝나면 결과창이 활성화됩니다.<p> 전체 플레이어들의 색깔과 역할을 알수 있습니다.</p>`;
  }
  else {
    top = offset + 55;
    Id('helpDiv').style.left = 100+"px";
    if ( id == 'help1') Id('helpDiv').innerHTML = ""+`<p>한 색깔을 지정해 대상이 알파이면 게임에서 승리합니다.<p>
    만약 그 대상이 알파가 아닌경우 Q는 게임에서 제외됩니다.</p>`;
    else if ( id == 'help2') Id('helpDiv').innerHTML = "<p>플레이어 중 한명과 동맹을 맺습니다.</p>";
    else if ( id == 'help3') Id('helpDiv').innerHTML = "<p>Q의 이름으로 색깔을 숨기고 전체에 방송을 할 수 있습니다.(재사용 대기시간 120초)<p>";
  }
  Id('helpDiv').style.top = top+"px";
  Id('helpDiv').style.display = "block";
}
