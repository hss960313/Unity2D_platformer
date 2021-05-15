var flowCount = 0;
//시간이벤트는 개인에따라 다를수도 있다.
ClientSoc.on('timeflow', (response) => {
  if ( Id('timeflow')) {
    Id('timeflow').innerHTML = ""+ response.minutes + " : "+ response.second;
    flowCount++;
  }
  //
});
var deathCount = 0;
ClientSoc.on('DEATH', (death) =>{
  if ( death.color == Id('myColor').value )
    myDEATH();
  else
    delColor(death.color);
  deathCount++;
  if ( deathCount == 1) {

  }
});
function skill_Request() {
  switch ( Id('selectedSkill').value ) {
    case 'Q확인':
      skill_onlyColor(0, 'Q인지 확인합니다.');
      break;
    case '감시':
      skill_onlyColor(60, '카오스를 감시합니다.');
      break;
    case '동맹':
      skill_onlyColor(3, '동맹하기');
      break;
    case '방송':
      skill_Prompt(120, 'Q의 이름으로 방송합니다.');
      break;
    case '검거':
      skill_ColorRole(0, 'Q를 대신해 알파를 검거합니다.');
    break;
  }
  //V 는 Q확인을 사용하지 않으면 감시스킬을 2번 더 사용할수 있다.
  // 루비와 만나거나, 교란일 때 베타를 만나면 자동동맹된다.
}
function skill_emit() {
  switch ( Id('selectedSkill').value) {
    case 'Q확인':
      ClientSoc.emit('V_1', {

      });
    break;
    case '감시':
      ClientSoc.emit('V_2', {

      });
    break;
    case '동맹':
      ClientSoc.emit('ally', {

    });
    break;
    case '방송하기':
      ClientSoc.emit('broadcast', {

      });
      break;
    case '알파검거':
      ClientSoc.emit('arrest', {

    });
    break;
  }
}
function myDEATH() {
  Id('isAlive').value = 'false';
  //스킬들 disabled
  Id('Q확인').disabled = true;
  Id('감시').disabled = true;
  Id('동맹').disabled = true;
  Id('방송').disabled = true;
  if ( Id('검거') )
    Id('검거').disabled = true;
//대기리스트 등록 , 취소 disabled
  Id('switching_apply').disabled = true;
  Id('switching_cancel').disabled = true;
  //생존자리스트에서 내색깔 제거
  delColor(Id('myColor').value);
  //관전자 채팅만할수있게 제한하기.
  Id('toAll').disabled = true;
  Id('toAll').checked = false;
  Id('toAlly').disabled = true;
  Id('toBy').checked = true;
  Id('toBy').disabled = true;
  whom('관전자');
  //death-modal
  deathmodal_Open();
  //관전자방으로 이동
  ClientSoc.emit('go_bystander', Id('inRoom_rName').value);
}
