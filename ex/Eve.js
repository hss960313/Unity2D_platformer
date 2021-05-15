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
    case '동맹':
      skill_onlyColor(5, '대상과 동맹을 맺습니다');
  }
  //루비와 만나거나, 거교중 베타와 만날경우 자동동맹된다.
}
function skill_emit() {
  switch ( Id('selectedSkill').value) {
    case '카오스_검거':
      ClientSoc.emit('EVE_1', {

      });
    break;
    case '심판의_조각':
      ClientSoc.emit('EVE_2', {

      });
    break;
    case '동맹':
      ClientSoc.emit('ally', {

    });
    break;
    case '방송':
      ClientSoc.emit('broadcast', {

      });
      break;
    case '검거':
      ClientSoc.emit('arrest', {

    });
    break;
  }
}
function myDEATH() {
  Id('isAlive').value = 'false';
  //스킬들 disabled
  Id('카오스_검거').disabled = true;
  Id('심판의_조각').disabled = true;
  Id('동맹').disabled = true;
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
