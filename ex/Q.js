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
    case '알파검거':
      skill_onlyColor(0, '범인을 검거합니다.');
      break;
    case '동맹':
      skill_onlyColor(3, '동맹하기');
      break;
    case '방송':
      skill_Prompt(120, 'Q의 이름으로 방송합니다.');
      break;
  }
  //Q는 모든 명교의 진실,거짓을 알수있다. 단 어떤 직업을 냈는지는 알수없다.
}
function skill_emit() {
    let e =  Id('selectedSkill').value;
    let eName;
    if ( e == '알파검거') eName = 'arrest';
    else if ( e == '동맹하기') eName = 'ally';
    else if ( e == '방송하기') eName = 'broadcast';
    ClientSoc.emit('good', {
      eventName : eName,
      rName : Id('inRoom_rName').value,
      color : Id('selectedColor').value,
      prompt : Id('promptText').value
    });
  }
}
ClientSoc.on('arrest', (response)=>{
  if ( response.isArrest == 'O') {
    briefing('', '알파를 검거했습니다. 당신의 승리입니다.');
  }
  else {
    briefing(response.color, '는 알파가 아닙니다. 당신은 죽을 것입니다.');
  }
});

function skill_disabled() {
  Id('알파검거').disabled = true;
  Id('동맹하기').disabled = true;
  Id('방송하기').disabled = true;
}
function skill_abled() {

}
