var flowCount = 0;
//시간이벤트는 개인에따라 다를수도 있다.
ClientSoc.on('timeflow', (response) => {
  if ( Id('timeflow')) {
    Id('timeflow').innerHTML = ""+ response.minutes + " : "+ response.second;
    flowCount++;
  }
  if (flowCount >= 2100) {
    BACK_Request();
  }
});

ClientSoc.on('DEATH', (death) =>{
    if ( death.color == Id('myColor').value )
      myDEATH();
    else
      delColor(death.color);

});
function skill_Request() {
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
  //루비와 만나거나, 거교중 베타와 만날경우 자동동맹된다.
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
var hasSUSA = false;
ClientSoc.on('EVE_1', (response)=>{
  if ( response.isArrest == 'O') {
    briefing('', '카오스를 검거하는데 성공했습니다. 심판의 조각을 얻습니다.');
    hasSUSA = true;
  }
  else
    briefing(response.color, `는 카오스가 아닙니다. 당신의 정체가 모두에게 알려집니다.`);
});
//심판의 조각
ClientSoc.on('EVE_2', (response)=>{
  if ( response.answer == 'O') {
    briefing(response.color, `를 심판했습니다.`);
  }
  else {
    briefing(response.color, `의 심판에 실패했습니다. 당신의 정체가 모두에게 알려집니다.`);
  }
});
function skill_disabled() {
  Id('카오스_검거').disabled = true;
  Id('심판의_조각').disabled = true;
  Id('동맹하기').disabled = true;
}
function skill_abled() {

}
