var good = function(DB, serverDB, io) {
  this.DB = DB;
  this.serverDB = serverDB;
  this.io = io;
};
var proto = good.prototype;


module.exports = good;
proto.get_SOCPRACTICE = function() {
  var soclist = [];
  console.log('before');
  DB.get_SOCPRACTICE(serverDB, soclist)
    .then(()=>{
      console.log("then");
      console.log(soclist);
      for (let k=0; k < soclist.length; k++)
        console.log(soclist[k]);
    });
}
