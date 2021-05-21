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
    briefing(death.color, death.announce);

});
function skill_Request() {
  switch ( Id('selectedSkill').value ) {
    case '베타검거':
      skill_onlyColor(0, '베타를 검거합니다.');
      //베티 검거에 성공하면 수사권을 얻는다.
      break;
    case '동맹하기':
      skill_onlyColr(3, '대상과 동맹을 맺습니다.');
  }
  //루비는 니아와 메로 중 먼저 만난 사람과 자동동맹된다.
}
function skill_emit() {
  let e =  Id('selectedSkill').value;
  let eName;
  if ( e == '베타검거') eName = 'Ruby';
  else if ( e == '동맹하기') eName = 'ally';

  ClientSoc.emit('good', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value
  });
}
function skill_disabled() {
  Id('베타검거').disabled = true;
  Id('동맹하기').disabled = true;
}
var hasSUSA = false;
ClientSoc.on('Ruby', (response)=>{
  if ( response.isArrest == 'O') {
    briefing('', '당신은 베타검거에 성공했습니다. 수사권을 얻습니다.');
    hasSUSA = true;
  }
  else {
    briefing(response.color, '는 베타가 아닙니다. 당신의 정체가 모두에게 알려집니다');
  }
});
function skill_abled() {

}
var inactiveList = [];
