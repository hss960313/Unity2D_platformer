var flowCount = 0;
//시간이벤트는 개인에따라 다를수도 있다.
ClientSoc.on('timeflow', (response) => {
  if ( Id('timeflow')) {
    Id('timeflow').innerHTML = ""+ response.minutes + " : "+ response.second;
    flowCount++;
  }
  //
  if ( flowCount == 600) {
    Id('진실의눈').disabled = false;
  }
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
    case '진실의눈': //skill1
      skill_onlyColor(0, '진명을 꿰뚫어봅니다.');
      break;
    case '동맹':
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
  switch ( Id('selectedSkill').value) {
    case '진실의눈':
      ClientSoc.emit('Beta_1', {

      });
    break;
    case '동맹':
      ClientSoc.emit('ally', {

      });
    break;
    case '사칭':
      ClientSoc.emit('broadcast', {

    });
    break;
    case '교란':
      ClientSoc.emit('Beta_2', {

      });
    break;

  }
}
function skill_noModal(coolTime) {
  skill_emit();
}
function myDEATH() {
  Id('isAlive').value = 'false';
  //스킬들 disabled
  Id('진실의눈').disabled = true;
  Id('동맹').disabled = true;
  Id('사칭').disabled = true;
  Id('교란').disabled = true;
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
