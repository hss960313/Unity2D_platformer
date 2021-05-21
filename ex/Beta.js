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
  if ( flowCount == 480) {
    Id('진실의눈').disabled = false;
  }
});

ClientSoc.on('DEATH', (death) =>{

    if ( death.color == Id('myColor').value )
      myDEATH();
    else
      delColor(death.color);
    briefing(death.color, death.announce);

});
function skill_Request() {
  switch ( Id('selectedSkill').value ) {
    case '진실의눈': //skill1
      skill_onlyColor(0, '진명을 꿰뚫어봅니다.');
      break;
    case '동맹하기':
      skill_onlyColor(3, '대상과 동맹을 맺습니다.');
      break;
    case '사칭':
      skill_Prompt(0, 'Q의 이름으로 방송합니다.');
      break;
    case '교란':
      skill_noModal(60);
      break;
  }
  //교란 상태일때 V, EVE중 한사람을 만나면 먼저만난사람과 자동동맹된다.(한번)
}
function skill_emit() {
  let e =  Id('selectedSkill').value;
  let eName;
  if ( e == '진실의눈') eName = 'Beta_1';
  else if ( e == '교란') eName = 'Beta_2';
  else if ( e == '사칭') eName = 'Beta_3';
  else if ( e == '동맹하기') eName = 'ally';
  ClientSoc.emit('evil', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value,
    prompt : Id('promptText').value
  });
}
ClientSoc.on('Beta_1', (response) => {
  briefing(response.color, `는  ${response.role} 입니다.`);
});

ClientSoc.on('Beta_2', () => {
  briefing('', `!지금부터 1분간 모든 거짓말 탐지기가 거짓으로 표시됩니다.`);
});

function skill_noModal(coolTime) {
  reUseWait(Id('selectedSkill').value, coolTime);
  skill_emit();
}
function skill_disabled() {
  Id('진실의눈').disabled = true;
  Id('동맹하기').disabled = true;
  Id('사칭').disabled = true;
  Id('교란').disabled = true;
}
function skill_abled() {

}
