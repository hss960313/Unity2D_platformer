//시간이벤트는 개인에따라 다를수도 있다.
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
    case '카오스_검거':
      skill_onlyColor(0, '카오스를 검거합니다.');
      //카오스 검거에 성공하면 심판의 조각과 수사권을 얻는다.
      break;
    case '심판의_조각':
      skill_ColorRole(0, '단 한번, 대상을 심판합니다.');
      break;
    case '동맹하기':
      skill_onlyColor(5, '대상과 동맹을 맺습니다');
  }
}
}
function skill_emit() {
  let e =  Id('selectedSkill').value;
  let eName;
  if ( e == '카오스_검거') eName = 'EVE_1';
  else if ( e == '심판의_조각') eName = 'EVE_2';
  else if ( e == '동맹하기') eName = 'ally';
  ClientSoc.emit('good', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value,
    role : Id('selectedRole').value
  });
}
//카오스 검거
timeTroubleList.push('심판의_조각');
timeTroubleList.push('동맹하기');
ClientSoc.on('EVE_1', (response)=>{
  if ( response.isArrest == 'O') {
    briefing('', '카오스를 검거하는데 성공했습니다. 심판의 조각을 얻습니다.');
    hasSUSA = true;
    timeTroubleList.pop();
    timeTroubleList.pop();
    abled('심판의_조각');
    abled('동맹하기');
  }
});
//심판의 조각
ClientSoc.on('EVE_2', (response)=>{
  if ( response.answer == 'O') {
    briefing(response.color, `의 심판에 성공했습니다.`);
  }
});
ClientSoc.on('switchingE', (response)=>{
  briefing('', response.announce);
});
function skill_disabled() {
  disabled('카오스_검거');
  disabled('심판의_조각');
  disabled('동맹하기');
}
function skill_abled() {
  abled('카오스_검거');
  abled('심판의_조각');
  abled('동맹하기');
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
    if ( id == 'help1') Id('helpDiv').innerHTML = ""+`<p>플레이어 중 하나를 골라 그 대상이 카오스면 게임에서 제외시킵니다.( 1번 사용가능 )<p>
    카오스를 검거하는데 성공하면 수사권을 얻습니다.<p>만약 실패하면 당신의 정체가 모두에게 알려질 것입니다.</p>`;
    else if ( id == 'help2') Id('helpDiv').innerHTML = ""+`<p>카오스를 검거한 경우 사용 가능합니다.<p>색깔 하나와 이름 하나를 골라 그 색깔의 플레이어의 정체가 그 이름인경우 게임에서 제외합니다.<p>만약 실패하면 당신은 죽을 것입니다.`;
    else if ( id == 'help3') Id('helpDiv').innerHTML = ""+`<p>카오스를 검거한 경우 사용 가능합니다. 다른 플레이어와 동맹을 맺습니다.</p>`;
  }
  Id('helpDiv').style.top = top+"px";
  Id('helpDiv').style.display = "block";
}
