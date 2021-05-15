var flowCount = 0;
//시간이벤트는 개인에따라 다를수도 있다.
ClientSoc.on('timeflow', (response) => {
  if ( Id('timeflow')) {
    Id('timeflow').innerHTML = ""+ response.minutes + " : "+ response.second;
  }
  flowCount++;
  if (flowCount == 180) {
    hasSUSA = true;
  }
});
function skill_Request() {
  switch ( Id('selectedSkill').value ) {
    case '심판':
      skill_ColorRole(60, '대상을 심판할수 있습니다.');
      break;
    case '파멸':
      skill_ColorRole(0, '대상을 파멸시킬수 있습니다.');
      break;
    case '동맹':
      skill_onlyColor(3, '대상과 동맹을 맺습니다.');
      break;
    case '방송하기':
      skill_Prompt(120, 'Q의 이름으로 방송합니다.');
      break;
  }
  //Alpha는 Beta와 이름교환시 자동으로 동맹이 된다.
}
var deathCount = 0;
var hasSUSA = false;
ClientSoc.on('DEATH', (death) =>{
  if ( death.color == Id('myColor').value )
    myDEATH();
  else
    delColor(death.color);

  deathCount++;

  //Alpha는 게임에서 한명이상 제외되었을 때 수사권을 얻음.
  if ( deathCount == 1) {
    hasSUSA = true;
  }
});
function skill_emit() {
  switch ( Id('selectedSkill').value) {
    case '심판':
      ClientSoc.emit('Alpha_1', {

      });
    break;
    case '파멸':
      ClientSoc.emit('Alpha_2', {

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
  }
}
function myDEATH() {
  Id('isAlive').value = 'false';
  //스킬들 disabled
  Id('심판').disabled = true;
  Id('파멸').disabled = true;
  Id('동맹').disabled = true;
  Id('방송').disabled = true;
//대기리스트 등록 , 취소 disabled
  Id('switching_apply').disabled = true;
  Id('switching_cancel').disabled = true;
  //생존자리스트에서 내색깔 제거
  delColor(Id('myColor').value);
  //관전자 채팅만하도록 제한
  Id('toAll').disabled = true;
  Id('toAll').checked = false;
  Id('toAlly').disabled = true;
  Id('toBy').checked = true;
  Id('toBy').disabled = true;
  whom('관전자');
  //죽음창 팝업
  deathmodal_Open();
  //관전자방으로 이동
  ClientSoc.emit('go_bystander', Id('inRoom_rName').value);
}
