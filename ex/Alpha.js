var deathCount = 0;
timeTroubleList.push('파멸');
timeTroubleList.push('동맹하기');
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
    else {
      delColor(death.color);
    }
    briefing(death.color, death.announce);
    deathCount++;

    //Alpha는 게임에서 한명이상 제외되었을 때 수사권을 얻음.
    if ( deathCount == 1) {
      hasSUSA = true;
      timeTroubleList.splice(1,1);
      briefing('', '게임에서 한명이 제외되었으므로 수사권을 얻습니다.');
      abled('동맹하기');
    }
    //두 명이상 제외됐을 때 파멸 사용가능.
    if ( deathCount == 2) {
      timeTroubleList.splice(0,1);
      briefing('', '게임에서 두 명이 제외되었으므로 파멸을 사용할 수 있습니다.');
      abled('파멸');
    }
  }
});
function skill_Request() {
  if ( Id(Id('selectedSkill').value).disabled == true) {
    switch ( Id('selectedSkill').value ) {
      case '심판':
        skill_ColorRole(60, '대상을 심판할수 있습니다.');
        break;
      case '파멸':
        skill_ColorRole(0, '대상을 파멸시킬수 있습니다.');
        break;
      case '동맹하기':
        skill_onlyColor(3, '대상과 동맹을 맺습니다.');
        break;
    }
  }
}

function skill_emit() {
  let e =  Id('selectedSkill').value;
  let eName;
  if ( e == '심판') eName = 'Alpha_1';
  else if ( e == '파멸') eName = 'Alpha_2';
  else if ( e == '동맹하기') eName = 'ally';
  ClientSoc.emit('evil', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value,
    role : Id('selectedRole').value,
  });
}

ClientSoc.on('Alpha_1', (response)=>{
  let ans = response.answer;
  if ( ans == 'O') briefing('', `당신은 `+IMG(response.color)+` : ${response.role}를 심판하는데에 성공했습니다. `);
  else if ( ans == 'X') briefing('', `심판에 실패했습니다. `+IMG(response.color)+`는 ${response.role}가 아닙니다. `);
  else if ( ans == 'BAN') briefing('', `심판에 실패했습니다. 당신은 더이상 ${response.role}을 심판할 수 없습니다.`);
  else if ( ans == 'BANNED') briefing('', `심판에 실패했습니다. ${response.role}는 더이상 심판할 수 없는 인물입니다.`);
  else if ( ans == 'death') briefing('', '당신은 4번 심판에 실패했습니다. 당신의 패배입니다.');
  else if ( ans == 'V') briefing('', 'Q가 죽기 전에는 V에 대해 심판할 수 없습니다.');
});

ClientSoc.on('Alpha_2', (response)=> {
  let ans = response.answer;
  if ( ans == 'O') briefing('', `당신은 `+IMG(response.color)+` : ${response.role}를 파멸시키는 데에 성공했습니다. `);
  else if ( ans == 'X') briefing('', `당신은 `+IMG(response.color)+`를 파멸시키는데에 실패했습니다. `);
});
ClientSoc.on('switchingE', (response)=>{
  briefing('', response.announce);
});
function skill_disabled() {
  disabled('심판');
  disabled('파멸');
  disabled('동맹하기');
}
function skill_abled() {
  abled('심판');
  abled('파멸');
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
    if ( id =='help1') Id('helpDiv').innerHTML = ""+`</p>색깔 하나와 이름 하나를 골라 그 색깔의 참가자의 정체가 그 이름이라면 게임에서 제외시킵니다.
    (재사용 대기시간 60초)<p>4번 실패하는 경우 게임에서 패배합니다.</p>Q가 죽기전에는 상대가 V인경우에는 죽일 수 없습니다.<p>
    같은 이름을 두 번 실패하면 그 이름은 더이상 심판할 수 없습니다.</p>`;
    else if ( id == 'help2') Id('helpDiv').innerHTML = ""+`<p>게임에서 두 명이상 제외되었을 경우 게임 중 한번 사용 가능합니다.<p>색깔 하나와 이름 하나를 골라 그 색깔의 플레이어의 정체가 그 이름인경우 게임에서 제외합니다.<p> V 혹은 더이상 심판할 수 없는 인물도 파멸로 게임에서 제외시킬 수 있습니다.<p>`;
    else if ( id == 'help3') Id('helpDiv').innerHTML = ""+`<p>수사권을 가졌을때 사용할 수 있습니다. 플레이어 중 한명과 동맹을 맺습니다.<p>`;
  }
  Id('helpDiv').style.top = top+"px";
  Id('helpDiv').style.display = "block";
}
