var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'sk!@3tkffleh',
  database : 'HSS'
});
function Query(a, b) {
  connection.query(a, b);

};
connection.connect();
/*
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
*/


Query('truncate table soc_es', (error, results, fields) => {
  //console.log(error);
});
Query('drop table soc_es', (error, results, fields) => {
  //console.log(error);
});
Query(`CREATE TABLE soc_es (
  sid VARCHAR(30) PRIMARY KEY,
  rName VARCHAR(20),
  rdy VARCHAR(10),
  isStart VARCHAR(10),
  role VARCHAR(20)
)`, (error, results, fields) => {});

connection.end();

function initDB(mysql) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'sk!@3tkffleh',
    database : 'HSS'
  });
  connection.connect();
  connection.query('truncate table soc_es', '');
  connection.query('drop table soc_es', '');
  connection.query(`CREATE TABLE soc_es (
    sid VARCHAR(30) PRIMARY KEY,
    rName VARCHAR(20),
    rdy VARCHAR(10),
    isStart VARCHAR(10),
    role VARCHAR(20)
  )`, '');
  connection.end();
}
function queryDB(mysql, A,B) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'sk!@3tkffleh',
    database : 'HSS'
  });
  connection.connect();
  connection.query(a,b);
  connection.end();
}
