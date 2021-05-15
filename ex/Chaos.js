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
  switch ( Id('selectedSkill').value) {
    case '정체밝히기':
      ClientSoc.emit('Chaos', {

      });
    break;
    case '방송하기':
      ClientSoc.emit('broadcast', {

      });
    break;
  }
}
function myDEATH() {
  Id('isAlive').value = 'false';
  //스킬들 disabled
  Id('정체밝히기').disabled = true;
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
