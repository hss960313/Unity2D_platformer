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
    case 'Q확인':
      skill_onlyColor(0, 'Q인지 확인합니다.');
      break;
    case '감시':
      skill_onlyColor(60, '카오스를 감시합니다.');
      break;
    case '동맹하기':
      skill_onlyColor(3, '동맹을 맺습니다.');
      break;
    case '방송하기':
      skill_Prompt(120, 'Q의 이름으로 방송합니다.');
      break;
    case '알파검거':
      skill_onlyColor(0, 'Q를 대신해 알파를 검거합니다.');
    break;
  }
  //V 는 Q확인을 사용하지 않으면 감시스킬을 2번 더 사용할수 있다.
  // 루비와 만나거나, 교란일 때 베타를 만나면 자동동맹된다.
}
function skill_emit() {
  let e = Id('selectedSkill').value;
  let eName;
  if ( e == 'Q확인') eName = 'V_1';
  else if ( e == '감시') eName = 'V_2';
  else if ( e == '동맹하기') eName = 'ally';
  else if ( e == '방송하기') eName = 'broadcast';
  else if ( e == '알파검거') eName = 'arrest';
  ClientSoc.emit('good', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value,
    role : Id('selectedRole').value,
    prompt : Id('promptText').value
  });
}
function skill_disabled() {
  if ( Id('Q확인'))
    Id('Q확인').disabled = true;
  Id('감시').disabled = true;
  Id('동맹하기').disabled = true;
  Id('방송하기').disabled = true;
  if ( Id('알파검거') )
    Id('알파검거').disabled = true;
}
var death_Q = false;
ClientSoc.on('death_Q', ()=>{
  death_Q = true;
  briefing('', 'Q가 죽었습니다. Q의 모든 능력을 얻습니다.');
  Id('help1').innerHTML = ""+ `<button class="Skillbutton" value = '1' id='알파검거'>알파검거</button></p>`;
  if ( isSwitchingOn == true || Id('isAlive').value == 'false') {
    Id('알파검거').disabled = true;
    Id('방송하기').disabled = true;
  }
  else {
    Id('방송하기').disabled = false;
  }
});
//Q확인
ClientSoc.on('V_1', (response)=>{
  if ( response.answer == 'O')
    briefing('', `확인결과, `+IMG(response.color)+` 는 Q입니다.`);
  else
    briefing('', `확인결과, `+IMG(response.color)+` 는 Q가 아닙니다.`)
});
//카오스감시
ClientSoc.on('V_2', (response)=>{
  briefing(response.color, '를 감시합니다.');
});
//알파검거
ClientSoc.on('arrest', (response)=>{
  if ( response.isArrest == 'O') {
    briefing('', '알파를 검거했습니다. 당신의 승리입니다.');
  }
  else {
    briefing(response.color, '는 알파가 아닙니다. 당신의 정체가 모두에게 알려집니다.');
  }
});
function skill_abled() {

}
