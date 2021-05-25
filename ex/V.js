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
    case 'Q확인':
      skill_onlyColor(0, 'Q인지 확인합니다.');
      break;
    case '감시':
      skill_onlyColor(90, '카오스를 감시합니다.');
      break;
    case '동맹하기':
      skill_onlyColor(3, '동맹을 맺습니다.');
      break;
    case '방송하기':
      skill_Prompt(120, 'Q의 이름으로 방송합니다.');
      break;
    case '알파검거':
      skill_onlyColor(0, 'Q를 대신해 알파를 검거합니다.');
    break;
  }
  //V 는 Q확인을 사용하지 않으면 감시스킬을 2번 더 사용할수 있다.
  // 루비와 만나거나, 교란일 때 베타를 만나면 자동동맹된다.
}
}
function skill_emit() {
  let e = Id('selectedSkill').value;
  let eName;
  let prompt = '';
  if ( Id('prompt'))
    prompt = Id('prompt').value;
  if ( e == 'Q확인') eName = 'V_1';
  else if ( e == '감시') eName = 'V_2';
  else if ( e == '동맹하기') eName = 'ally';
  else if ( e == '방송하기') eName = 'broadcast';
  else if ( e == '알파검거') eName = 'arrest';
  ClientSoc.emit('good', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value,
    role : Id('selectedRole').value,
    prompt : prompt
  });
}

timeTroubleList.push('알파검거');
timeTroubleList.push('방송하기');
ClientSoc.on('death_Q', ()=>{
  isDetective = true;
  hasSUSA = true;
  timeTroubleList.pop();
  timeTroubleList.pop();
  briefing('', 'Q가 죽었습니다. 당신은 Q의 후계자로 반드시 알파를 검거해야 합니다. 최신식 거짓말 탐지기를 얻었습니다.');
  Id('help1').innerHTML = ""+ `<button class="Skillbutton" onclick="clickSkill(this);"value = '1' id='알파검거' disabled>알파검거</button></p>`;

  abled('알파검거');
  abled('방송하기');
});

//Q확인
ClientSoc.on('V_1', (response)=>{
  if ( response.answer == 'O')
    briefing('', `확인결과, `+IMG(response.color)+` 는 Q가 맞습니다.`);
  else
    briefing('', `확인결과, `+IMG(response.color)+` 는 Q가 아닙니다.`)
});

//카오스감시
ClientSoc.on('V_2', (response)=>{
  briefing(response.color, '를 감시합니다.');
});
//알파검거
ClientSoc.on('arrest', (response)=>{
  if ( response.isArrest == 'O') {
    briefing('', '알파를 검거했습니다. 당신의 승리입니다.');
  }
});
ClientSoc.on('switchingE', (response)=>{
  briefing('', response.announce1 +" "+ IMG(response.color)+" "+response.announce2);
});
function skill_disabled() {
  disabled('Q확인');
  disabled('감시');
  disabled('동맹하기');
  disabled('방송하기');
  disabled('알파검거');
}
function skill_abled() {
  abled('Q확인');
  abled('감시');
  abled('동맹하기');
  abled('방송하기');
  abled('알파검거');
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
    if ( id == 'help1') {
      if ( isDetective == false)
        Id('helpDiv').innerHTML = ""+`<p>플레이어 한 명을 선택해 그 정체가 Q인지 아닌지 알 수 있습니다. (1번 사용가능)`;
      else if ( isDetective == true)
        Id('helpDiv').innerHTML = ""+`<p>당신은 Q의 후계자로 알파를 검거할 수 있습니다.( 1번 사용가능 )<p>
        만약 알파를 검거하는데 실패한다면 이 게임에서 패배합니다.`;
    }
    else if ( id == 'help2') Id('helpDiv').innerHTML = ""+`<p>플레이어 한 명을 선택해 감시합니다.(재사용 대기시간 90초)<p> 그 대상이 카오스인경우 정체밝히기 스킬의 사용을 60초 동안 사용할 수 없습니다.`;
    else if ( id == 'help3') Id('helpDiv').innerHTML = ""+`<p>당신은 독자적인 수사권을 가지고 있습니다. 상대방과 동맹을 맺습니다.`;
    else if ( id == 'help4') Id('helpDiv').innerHTML = ""+`<p>Q가 죽으면 활성화.<p>당신은 Q의 이름을 빌려 정체를 숨기고 전체에게 말할 수 있습니다.(재사용 대기시간 120초)`;

    Id('helpDiv').style.top = top+"px";
    Id('helpDiv').style.display = "block";
  }
}
