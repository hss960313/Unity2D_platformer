function evil(DB, serverDB, io) {
  this.DB = DB;
  this.server = serverDB;
  this.io = io;
}

var proto = evil.prototype;

module.exports = evil;
