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
    case '정체밝히기':
      skill_ColorRole(45, '대상의 정체를 밝힙니다.');
      // Q, V, EVE 제외
      break;
    case '방송하기':
      skill_Prompt(3, '카오스의 이름으로 방송합니다.');
      break;
  }
}
function skill_emit() {
  let e =  Id('selectedSkill').value;
  let eName;
  if ( e == '정체밝히기') eName = 'Chaos';
  else if ( e == '방송하기') eName = 'broadcast';
  ClientSoc.emit('evil', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value,
    role : Id('selectedRole').value,
    prompt : Id('promptText').value
  });
}
var isObserve = false;
ClientSoc.on('감시', ()=>{
  isObserve = true;
  setTimeout(()=>{
    isObserve = false;
  }, 1000*50);
});

ClientSoc.on('Chaos', (response)=>{
  if ( response.answer == 'O')
    briefng(response.color, `의 정체는 ${response.role} 입니다.`);
  else
    briefing(response.color, `는 ${response.role}이 아닙니다.`);
});
function skill_disabled() {
  Id('정체밝히기').disabled = true;
  Id('방송').disabled = true;
}
function skill_abled() {

}
