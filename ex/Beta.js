//시간이벤트는 개인에따라 다를수도 있다.
timeTroubleList.push('진실의눈');
ClientSoc.on('timeflow', (response) => {
  if ( Id('timeflow')) {
    Id('timeflow').innerHTML = ""+ response.minutes + " : "+ response.second;
  }
  flowCount++;
  if (flowCount == 60*35) {
      BACK2Lobby();
  }
  if ( flowCount == 60*10) {
    timeTroubleList.splice(0,1);
    abled('진실의눈');
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
    case '진실의눈': //skill1
      skill_onlyColor(0, '진명을 꿰뚫어봅니다.');
      break;
    case '사칭':
      skill_Prompt(0, 'Q의 이름으로 방송합니다.');
      break;
    case '교란':
      skill_noModal(120);
      break;
  }
}
}
function skill_emit() {
  let e =  Id('selectedSkill').value;
  let eName;
  let prompt = '';
  if ( Id('prompt'))
    prompt = Id('prompt').value;
  if ( e == '진실의눈') eName = 'Beta_1';
  else if ( e == '교란') eName = 'Beta_2';
  else if ( e == '사칭') eName = 'Beta_3';
  ClientSoc.emit('evil', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value,
    prompt : prompt
  });
}
ClientSoc.on('Beta_1', (response) => {
  briefing(response.color, `는  ${response.role} 입니다.`);
});

ClientSoc.on('Beta_2', () => {
  briefing('', `지금부터 60초 동안 모든 거짓말 탐지기가 거짓으로 표시됩니다.`);
  setTimeout(()=>{
    briefing('', '교란이 끝났습니다.');
  },1000*60)
});
ClientSoc.on('switchingE', (response)=>{
  briefing('', response.announce);
});
function skill_noModal(coolTime) {
  reuse_Request(coolTime);
}
function skill_disabled() {
  disabled('진실의눈');
  disabled('사칭');
  disabled('교란');
}
function skill_abled() {
  abled('진실의눈');
  abled('사칭');
  abled('교란');
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
    if ( id == 'help1') Id('helpDiv').innerHTML = "<p>10분에 활성화. 게임 중 한번만 사용가능하다.<p>한 플레이어를 선택해 그 정체를 얻는다.</p>";
    else if ( id == 'help2') Id('helpDiv').innerHTML = "<p>게임 중 한 번 Q의 이름으로 모두에게 방송을 할수있다. 이 메시지는 Q는 볼수 없다.</p>";
    else if ( id == 'help3') Id('helpDiv').innerHTML = "<p>60초 동안 모든 거짓말 탐지기의 답을 거짓으로 만든다. (재사용 대기시간 120초, 총 2회)</p>";
  }
  Id('helpDiv').style.top = top+"px";
  Id('helpDiv').style.display = "block";
}
