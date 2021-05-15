const DB = require("./DB");
const mysql = require('mysql');
const serverDB = DB.create(mysql, 'localhost', '3306', 'root', 'sk!@3tkffleh', 'HSS');
const GOOD = require('./SERVER_goodJS');
var connected;
var kk;
const good = require('./SERVER_goodJS');
DB.connect(serverDB)
  .then(()=>{
    kk = new GOOD(DB, serverDB);
    console.log(kk);
  });
  //kk.get_socList();
