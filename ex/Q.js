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
    case '알파검거':
      skill_ColorRole(0, '범인을 검거합니다.');
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
  switch ( Id('selectedSkill').value) {
    case '알파검거':
      ClientSoc.emit('arrest', {

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
  }
}
function myDEATH() {
  Id('isAlive').value = 'false';
  //스킬들 disabled
  Id('알파검거').disabled = true;
  Id('동맹').disabled = true;
  Id('방송').disabled = true;
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
