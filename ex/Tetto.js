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

  if ( flowCount == 150 ) {
    time_skils.pop();
  }
});
var time_skills = ['이름훔치기'];

ClientSoc.on('DEATH', (death) =>{
    if ( death.color == Id('myColor').value )
      myDEATH();
    else
      delColor(death.color);
    briefing(death.color, death.announce);

});
function skill_Request() {
  switch ( Id('selectedSkill').value ) {
    case '이름훔치기':
      skill_Color(120, '대상의 신분증을 훔칩니다.');
      break;
  }
  //알파, Q, V 에겐 거짓이름이 나타난다.
}
function skill_emit() {
  let e = Id('selectedSkill').value;
  let eName;
  if ( e == '이름훔치기') eName = 'Tetto';
  ClientSoc.emit('good', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value
  })
}
ClientSoc.on('Tetto', (response)=> {

});
function skill_disabled() {
  Id('이름훔치기').disabled = true;
}
function skill_abled() {
  var sql = reUseWaitList.indexOf('이름훔치기');
  var sql2 = time_skills.indexOf('이름훔치기');
  if ( !sql && !sql2 )
    Id('이름훔치기').disabled = false;
}
