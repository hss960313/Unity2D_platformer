
var DB = {};
var connection;

DB.create = function(mysql, host, port, user, pwd, db) {
  var connection =  mysql.createConnection({
    host     : host,  // 10.0.0.1
    port     : port, // 3306
    user     : user, // node960313
    password : pwd, // sktkffleh!@3
    database : db // node960313
  });
  return connection;
}
DB.connect = function(connection) {
  return new Promise(function(resolve, reject) {
    connection.connect();
    resolve(0);
  })
}
DB.init = function(connection) {
  connection.query('truncate table socList', (error) => {
    if ( error ) {
      console.log("truncate soclist err");
      connection.query(`CREATE TABLE socList (
        sid VARCHAR(30) PRIMARY KEY,
        nickname VARCHAR(30),
        nowLocation VARCHAR(20),
        isRdy VARCHAR(10),
        isStart VARCHAR(10)
        )`, (error)=> {
          if ( error) console.log("soclist already existed");
      });
    }
    else console.log('truncate socList ok');
  });
  connection.query('truncate table gameList', (error)=> {
    if ( error) {
      console.log("truncate gameList err");
      connection.query(`CREATE TABLE gameList (
        gName VARCHAR(20),
        Alpha VARCHAR(30),
        Beta VARCHAR(30),
        Chaos VARCHAR(30),
        Q VARCHAR(30),
        V VARCHAR(30),
        EVE  VARCHAR(30),
        RUBY  VARCHAR(30),
        TETTO  VARCHAR(30))`, (error)=> {
          if ( error) console.log("gameList already existed.");
      });
    }
    else console.log('truncate gameList ok');
  });
}
DB.connect = function(connection) {
  return new Promise(function(resolve, reject) {
    connection.connect();
    resolve(0);
  })
}
DB.getLoca = async function(connection, sid, list) {
  var a = await QQQ(connection, sid, list)

}
function QQQ(connection, sid, list) {
  return new Promise(function(resolve, reject){
    connection.query('select nowLocation from socList where sid = ?', [sid], (err, result)=>{
      if ( err) console.log('getLoca err');
      else {
        list.push(result[0]);
        resolve(0);
      }
    });
  })
}
DB.insert_newSoc = function(connection, sid) {
  connection.query(`INSERT INTO socList VALUES(?, '', 'lobby', false, false)`, [sid], (err)=> {
    if ( err)
      console.log("insert_newSoc err");
    else
      console.log("insert_newSoc ok");
  });
}
DB.insert_newGame = function(connection, gName) {
  connection.query("INSERT INTO gameList (gName) VALUES(?)", [gName], (err) =>{
    if ( err) console.log("insertgame err");
    else console.log("insert_newGame ok");
  });
}
DB.start = function(connection, gName, soclist) {
  for (let k=0; k < soclist.length; k++) {
    connection.query('UPDATE socList SET isStart = ? where sid = ?', [true, soclist[k]], (err) =>{
      if (err) console.log("start err");
    });
  }
}
DB.update_Location = function(connection, location, sid) {
  connection.query('UPDATE socList SET nowLocation = ? where sid= ?', [location, sid], (err) => {
    if ( err ) console.log("updateLocation err");
    else console.log("updateLocation ok");
  });
}

DB.update_Role = function(connection, role, soc, gname) {
  connection.query('update gameList SET '+role+' = ? where gName = ?', [soc, gname], (err, res)=> {
    if (err) console.log("roleupdate err ");
    else console.log("roleupdate ok");
  });
}
DB.delete_Soc = function(connection, sid) {
  connection.query('DELETE FROM socList where sid= ?',
   [sid], (err) => {
    if (err) console.log("deleteSoc err");
    else console.log("deleteSoc ok");
  });
}
DB.delete_Game = function(connection, gName) {
  connection.query('DELETE FROM gameList where gName = ?', [gName], (err) =>{
    if (err) console.log("deleteGame err");
    else console.log("deleteGame ok");
  })
}
DB.end = function(connection) {
  connection.end();
}

DB.get_SOCPRACTICE = async function(conn, list) {
  var a = await Q(conn, 'select sid from socpractice', list);

}
DB.get_socList = async function(conn, rName, list) {

  var a = await QQ(conn, rName, list);
  console.log("soclist in rName(",rName,") = ",list);
}

function Q(conn, query, list) {
  return new Promise((resolve, reject)=>{
    conn.query(query, (err, rows)=> {
    if ( err)
      console.log("Q err");
    else {
      for (var k=0; k < rows.length; k++) {
      list.push(rows[k].sid);
      if (k == rows.length-1)
        resolve(0);
      }
    }
    });
  });
}
function QQ(conn, rName, list) {
  return new Promise((resolve, reject)=>{
    conn.query('select sid from socList where nowLocation = ?', [rName], (err, rows)=> {
    if ( err) {
      console.log("QQ err");
    }
    else {
      for (var k=0; k < rows.length; k++) {
        console.log(rows[k].sid);
        list.push(rows[k].sid);

        if (k == rows.length-1)
          resolve(0);
      }
    }
    });
  });
}
module.exports = DB;
