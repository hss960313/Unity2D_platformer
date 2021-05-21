var flowCount = 0;
//시간이벤트는 개인에따라 다를수도 있다.
ClientSoc.on('timeflow', (response) => {
  if ( Id('timeflow')) {
    Id('timeflow').innerHTML = ""+ response.minutes + " : "+ response.second;
  }
  flowCount++;
  if (flowCount >= 2100) {
    BACK_Request();
  }
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
    case '동맹하기':
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

    briefing(death.color, death.announce);
    deathCount++;

    //Alpha는 게임에서 한명이상 제외되었을 때 수사권을 얻음.
    if ( deathCount == 1) {
      hasSUSA = true;
    }
});
function skill_emit() {
  let e =  Id('selectedSkill').value;
  let eName;
  if ( e == '심판') eName = 'Alpha_1';
  else if ( e == '파멸') eName = 'Alpha_2';
  else if ( e == '동맹하기') eName = 'ally';
  else if ( e == '방송하기') eName = 'broadcast';
  ClientSoc.emit('evil', {
    eventName : eName,
    rName : Id('inRoom_rName').value,
    color : Id('selectedColor').value,
    role : Id('selectedRole').value,
    prompt : Id('promptText').value
  });
}


ClientSoc.on('Alpha_1', (response)=>{
  let ans = response.answer;
  if ( ans == 'O') briefing('', `당신은 `+IMG(response.color)+` : ${response.role}를 심판하는데에 성공했습니다. `);
  else if ( ans == 'X') briefing('', `심판에 실패했습니다. `)
  else if ( ans == 'BAN') briefing('', `심판에 실패했습니다. 당신은 더이상 ${response.role}을 심판할 수 없습니다.`);
  else if ( ans == 'BANNED') briefing('', `더이상 심판할 수 없는 인물입니다.`);
  else if ( ans == 'death') briefing('', '당신은 4번이상 심판에 실패했습니다. 당신의 패배입니다.');
  else if ( ans == 'V') briefing('', 'Q가 죽기 전에는 V에 대해 심판할 수 없습니다.');
});

ClientSoc.on('Alpha_2', (response)=> {
  let ans = response.answer;
  if ( ans == 'O') briefing('', `당신은 `+IMG(response.color)+` : ${response.role}를 파멸시키는 데에 성공했습니다. `);
  else if ( ans == 'X') briefing('', `당신은 `+IMG(response.color)+`를 파멸시키는데에 실패했습니다. `);
  else if ( ans == 'V') briefing('', `Q가 죽기 전에는 V를 파멸시킬수 없습니다.`);
});

function skill_disabled() {
  Id('심판').disabled = true;
  Id('파멸').disabled = true;
  Id('동맹하기').disabled = true;
  Id('방송하기').disabled = true;
}
function skill_abled() {

}
