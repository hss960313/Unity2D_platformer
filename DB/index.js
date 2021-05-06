
var DB = {};
var connection;
DB.create = function(mysql, host, port, user, pwd, db) {
  var connection =  mysql.createConnection({
    host     : host,  // 10.0.0.1
    port     : port, // 3306
    user     : user, // node960313
    password : pwd, // sk!@3tkffleh
    database : db // node960313
  });
  return connection;
}
DB.connect = function(connection) {
  connection.connect();
}
DB.init = function(connection) {
  connection.query('truncate table socList', (error) => {
    if ( error ) {
      connection.query(`CREATE TABLE socList (
        sid VARCHAR(30) PRIMARY KEY,
        nickname VARCHAR(30),
        nowLocation VARCHAR(20),
        isRdy VARCHAR(10),
        isStart VARCHAR(10)
        )`, (error)=> {
        if ( error) console.log(error);
      });
    }
  });
  connection.query('truncate table gameList', (error)=> {
    if ( error) {
      connection.query(`CREATE TABLE gameList (
        Alpha VARCHAR(30),
        Beta VARCHAR(30),
        Chaos VARCHAR(30),
        Q VARCHAR(30),
        V VARCHAR(30),
        EVE  VARCHAR(30),
        RUBY  VARCHAR(30),
        TETTO  VARCHAR(30))`, (error)=> {
        if ( error) console.log(error);
      });
    }
  });
}
DB.insert = function(connection, sid) {
  connection.query(`INSERT INTO socList VALUES(?, '', 'lobby', false, false)`, [sid], (err)=> {
    if ( err)
      console.log(err);
  });
}
DB.updateLocation = function(connection, location, sid) {
  connection.query('UPDATE socList SET nowLocation = ? where sid= ?', [location, sid], (err) => {
    if ( err )
      console.log(err);
  });
}
DB.updateRole = function(connection, role, sid, rName) {
  connection.query('UPDATE gameList SET ? = ? where rName = ?', [role, sid, rName], (err) => {
    if ( err )
      console.log(err);
  });
}
DB.delete = function(connection, sid) {
  connection.query('DELETE FROM socList where sid= ?',
   [sid], (err) => { if (err) console.log(err);
  });
}

DB.end = function(connection) {
  connection.end();
}
module.exports = DB;
