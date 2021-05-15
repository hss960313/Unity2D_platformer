const mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sk!@3tkffleh',
  database: 'HSS'
});

conn.connect();
var gameList = {};
//DB에서 SOCLIST 찾아서 넣
var list= [];
var socs = ['soc1', 'soc2', 'soc3', 'soc4', 'soc5', 'soc6', 'soc7', 'soc8'];
var colors= ['red', 'blue', 'green', 'brown', 'pink', 'grey', 'purple', 'orange'];
var roles = ['Alpha', 'Beta', 'Chaos', 'Q', 'V', 'EVE', 'RUBY', 'TETTO'];
var roleSoc = {};
var colorSoc = {};
//셔플{
//
//}
A('g1');

//DB에는 rolesoc등//
async function A(gname) {
  var a = await Q();
  //셔플
  for ( let k=0; k < roles.length; k++) {
    var key = roles[k];
    roleSoc[key] = list[k];
    conn.query('update gameList SET '+key+' = ? where gName = ?', [list[k], gname], (err, res, fields)=> {
      if (err) console.log("roleupdate err ", err);
    });
    colorSoc[colors[k]] = list[k];
  }
  gameList['홍_colorSoc']  = colorSoc;
  gameList['홍_roleSoc'] = roleSoc;
conn.query("SELECT * from gameList where gName='g1'", (err, rows)=> {
  for (let k=0; k < rows.length; k++)
    console.log("rows=",rows[k]);
});
  console.log(gameList);
  //console.log(gameList['홍_colorSoc']['red']);
  //console.log(gameList['홍_roleSoc']['Alpha']);
  var h= compare_colrole('홍', 'red', 'Alpha');
  console.log("h=",h);
  conn.end();
}
function Q(list) {
  return new Promise((resolve, reject)=>{
    conn.query('SELECT sid from socpractice', (err, rows)=> {
    for (var k=0; k < rows.length; k++) {
      list.push(rows[k].sid);
      if (k == rows.length-1)
        resolve(0);
      }
    });
  });
}
function compare_colrole(r,a,b) {
  //console.log(list['홍_colorSoc'][a]);
  AA = gameList[''+r+'_colorSoc'][a];
  BB = gameList[''+r+'_roleSoc'][b];

  if ( AA == BB) {
    return 1;
  }
  else {
    return 0;
  }
