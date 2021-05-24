var flowCount = 0;
//시간이벤트는 개인에따라 다를수도 있다.
timeTroubleList.push('이름훔치기');
ClientSoc.on('timeflow', (response) => {
  if ( Id('timeflow')) {
    Id('timeflow').innerHTML = ""+ response.minutes + " : "+ response.second;
  }
  flowCount++;
  if (flowCount == 60*35) {
      BACK2Lobby();
  }

  if ( flowCount == 150 ) {
    timeTroubleList.splice(0,1);
    abled('이름훔치기');
  }
});

ClientSoc.on('DEATH', (death) =>{
  if ( Id('myColor')) {
    if ( death.color == Id('myColor').value )
      myDEATH();
    else
      delColor(death.color);
    briefing(death.color, death.announce);

  }
});
function skill_Request() {
  if ( Id(Id('selectedSkill').value).disabled == true) {
  switch ( Id('selectedSkill').value ) {
    case '이름훔치기':
      skill_onlyColor(180, '대상의 신분증을 훔칩니다.');
      break;
  }
}
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
  briefing(response.color, `의 신분증 이름은 ${response.steal} 입니다.`)
});
function skill_disabled() {
  disabled('이름훔치기');
}
function skill_abled() {
  abled('이름훔치기');
}
function helpOn(id) {
  var offset = Id(id).getBoundingClientRect().top;
  var top;
  if ( id == 'help0') {
    top = offset +26;
    Id('helpDiv').style.left = 150+"px";
    Id('helpDiv').innerHTML = ""+`게임이 끝나면 결과창이 활성화됩니다.<p> 전체 플레이어들의 색깔과 역할을 알수 있습니다.<p>`;
  }
  else {
    top = offset + 55;
    Id('helpDiv').style.left = 100+"px";
    if ( id == 'help1') Id('helpDiv').innerHTML = ""+`<p>게임시작 150초 후 활성화.<p>한 색깔의 이름을 훔칩니다. 만약 상대가 Alpha, Q, V 이면 거짓이름이 뜹니다.(재사용 대기시간 180초). 총 세 번 사용가능합니다.</p>`;
  }
  Id('helpDiv').style.top = top+"px";
  Id('helpDiv').style.display = "block";
}
