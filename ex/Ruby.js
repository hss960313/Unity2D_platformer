//시간이벤트는 개인에따라 다를수도 있다.
ClientSoc.on('timeflow', (response) => {
  if ( Id('timeflow')) {
    Id('timeflow').innerHTML = ""+ response.minutes + " : "+ response.second;
  }
  flowCount++;
  if (flowCount == 60*35) {
      BACK2Lobby();
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
    case '베타검거':
      skill_onlyColor(0, '베타를 검거합니다.');
      //베티 검거에 성공하면 수사권을 얻는다.
      break;
    case '동맹하기':
      skill_onlyColr(3, '대상과 동맹을 맺습니다.');
  }
}
}
function skill_emit() {
  let e =  Id('selectedSkill').value;
  let eName;
  if ( e == '베타검거') eName = 'Ruby';
  else if ( e == '동맹하기') eName = 'ally';

  ClientSoc.emit('good', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value
  });
}

timeTroubleList.push('동맹하기');
ClientSoc.on('Ruby', (response)=>{
  if ( response.isArrest == 'O') {
    briefing('', '당신은 베타검거에 성공했습니다. 수사권을 얻습니다.');
    hasSUSA = true;
    timeTroubleList.pop();
    abled('동맹하기');
  }
});
ClientSoc.on('switchingE', (response)=>{
  briefing('', response.announce);
});
function skill_disabled() {
  disabled('베타검거');
  disabled('동맹하기');
}
function skill_abled() {
  abled('베타검거');
  abled('동맹하기');
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
    if ( id  == 'help1') Id('helpDiv').innerHTML = ""+`<p>플레이어 중 하나를 골라 그 대상이 베타이면 베타를 게임에서 제외시킵니다.( 1번 사용가능)<p>
    만약 실패하면 당신의 정체가 모두에게 알려질 것입니다.</p>`;
    else if ( id  == 'help2') Id('helpDiv').innerHTML = ""+`<p>베타 검거에 성공한 다음에 사용할 수 있습니다.<p>
    상대방과 동맹을 맺습니다.</p>`;
  }

  Id('helpDiv').style.top = top+"px";
  Id('helpDiv').style.display = "block";
}
