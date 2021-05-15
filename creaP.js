const TIME = require('./SERVER_TimeJS');
var flow = new classe();

var se = setInterval(()=>{
  flow.setSecond();
  console.log(flow.getSecond());
  if ( flow.getSecond() == 60) {
    flow.setMinutes();
    flow.zeroSecond();
  }
  console.log(flow.printTime());
}, 1000);
