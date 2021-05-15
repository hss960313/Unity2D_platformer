function timeflow() {
  this.second = 0;
  this.minutes = 0;
}

var proto = timeflow.prototype;

proto.setSecond = function() {
  this.second += 1;
}

proto.getSecond = function() {
  return this.second;
}
proto.zeroSecond = function() {
  this.second = 0;
}

proto.setMinutes = function() {
  this.minutes += 1;
}

proto.getMinutes = function() {
  return this.minutes;
}
proto.printTime = function() {
    return ( this.minutes.toString().padStart(2, '0') +" : "+
  this.second.toString().padStart(2, '0') );
}

module.exports = timeflow;
