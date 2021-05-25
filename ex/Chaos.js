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
    case '정체밝히기':   // Q, V, EVE 제외
      skill_ColorRole(55, '대상의 정체를 밝힙니다.');
      break;
    case '방송하기':
      skill_Prompt(3, '카오스의 이름으로 방송합니다.');
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
  if ( e == '정체밝히기') eName = 'Chaos_1';
  else if ( e == '방송하기') eName = 'Chaos_2';
  ClientSoc.emit('evil', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value,
    role : Id('selectedRole').value,
    prompt : prompt
  });
}
ClientSoc.on('observe', ()=>{
  timeTroubleList.push('정체밝히기');
  briefing('', '당신은 감시당하고 있습니다.');
  Id('정체밝히기').disabled = true;
  setTimeout(()=>{
    timeTroubleList.pop();
    abled('정체밝히기');
  }, 1000*60);
});

ClientSoc.on('Chaos_1', (response)=>{
  if ( response.answer == 'O')
    briefing(response.color, `의 정체는 ${response.role} 입니다.`);
  else
    briefing(response.color, `는 ${response.role} 가 아닙니다.`);
});

function skill_disabled() {
  disabled('정체밝히기');
  disabled('방송하기');
}
function skill_abled() {
  abled('정체밝히기');
  abled('방송하기');
}
function helpOn(id) {
  var offset = Id(id).getBoundingClientRect().top;
  var top;
  if ( id == 'help0') {
    top = offset +26;
    Id('helpDiv').style.left = 150+"px";
    Id('helpDiv').innerHTML = ""+`게임이 끝나면 결과창이 활성화됩니다.<p> 전체 플레이어들의 색깔과 역할을 알수 있습니다.</p>`;
  }
  else {
    top = offset + 55;
    Id('helpDiv').style.left = 100+"px";
    if ( id == 'help1') Id('helpDiv').innerHTML = ""+`<p>색깔 하나와 이름 하나를 골라 그 색깔의 참가자의 정체가 그 이름인지 아닌지를 알 수 있다. (재사용 대
    기시간 55초, 12회 사용가능) Q, EVE의 정체는 알 수 없다.</p>`;
    else if ( id == 'help2') Id('helpDiv').innerHTML = ""+`<p> 색깔을 숨기고 카오스의 이름으로 전체에 방송을 할수 있습니다.(재사용 대기시간 3초)</p>`;
  }
  Id('helpDiv').style.top = top+"px";
  Id('helpDiv').style.display = "block";
}
