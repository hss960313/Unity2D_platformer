const { doDuring } = require("async");
const e = require("express");

var DB =  {};
var cafe24DB = {
    host: '10.0.0.1',
    port: '3306',
    user: 'node960313',
    password: 'sktkffleh!@3',
    database: 'node960313',
    insecureAuth: true
}
var localDB = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'sk!@3tkffleh',
    database: 'HSS',
    insecureAuth : true
}
DB.CAFE24 = function(mysql) {
  return mysql.createConnection(cafe24DB);
}
DB.LOCALHOST = function(mysql) {
  return mysql.createConnection(localDB);
}
DB.connect = function(conn) {
  return new Promise(function(resolve, reject) {
      conn.connect(function(err) {
          if(err) console.error('onnection error : ' + err);
      });
    resolve(0);
  })
}
  DB.getAccountList = async function(conn, list) {
    var a = await Q(conn, 'select id from AccountList', list);
    //console.log(list);
  }
  DB.getAllCharacterList = async function(conn, list) {
    console.log('rer');
    var a = await QC(conn, 'select cname from CharacterList', list);
  }
  DB.getIdCharacterList = async function(conn, id, list, res) {
    var a =await QI(conn, id, list, res);
  }

  DB.newAccount = async function(conn, id, pwd, res) {
    var a = await M(conn,id, pwd, res);
  }
//체크로그인
  DB.checkLogin = async function(conn, id, pwd, res) {
    var a = await D(conn, res, id , pwd);
  }
  DB.newCharacter = async function(conn, id, cname, head, hair, face, body, res) {
    var a = await QN(conn, id, res);
    if ( res[0] == '1')
      var b = await QNN(conn, id, cname, head, hair, face, body, res);
  }

  function QN(conn, id, res) {
    return new Promise((resolve, reject)=>{
      conn.query('select id from accountlist where id=?', [id], (err, rows)=>{
        if ( err) res[0] = '0';
        else {
          console.log("w"+rows[0]);
          if ( rows[0] == undefined) res[0] = '0';
          else
            res[0] = '1';
        }
        resolve(0);
      });
    });
  }
  function QNN(conn, id, cname, head, hair, face, body, res) {
    return new Promise((resolve, reject)=>{
      conn.query('INSERT INTO CharacterList VALUES(?, ?, ? , ?, ?, ?)',
      [id, cname , head , hair, face, body]
      , (err)=>{
        if ( err) res[0] = '0';
        else res[0] = '1';
        resolve(0);
      });
    });
  }
  DB.deleteAccount = async function(conn, id, pwd, res) {
    var resl = [];
    //1. 체크로그인
    var a = await D(conn, resl, id ,pwd);
    if ( resl[0] == '0') { // 체크로그인이 틀리면 틀림.
      res[0]= '0';
    }
    else
      var b = await QD(conn, id, res);
  }
  function QD(conn, id, res) {
    return new Promise((resolve, reject)=>{
      conn.query('DELETE FROM AccountList where id=?', [id], (err) => {
        if ( err ) { res[0] = '0'; resolve(0); }
        else
        conn.query('delete from Characterlist where id=?', [id], (err)=> {
          if (err) { res[0] = '0'; resolve(0); }
          else { res[0] = '1'; resolve(0); }
        });
      });
    })
    
  }
  DB.deleteCharacter =  async function(conn, id, pwd, cname, RES) {
    //1. 체크로그인
    var a = await D(conn, RES, id ,pwd);
    console.log("RES="+RES[0]);
    if ( RES[0] == '1')  // 체크로그인이 틀리면 틀림.
      var aa = await QDD(conn, cname, id, RES);
  }
  function QDD(conn, cname, id, RES) {
    return new Promise((resolve, reject)=>{
      conn.query('select id from characterlist where cname=?', [cname], (err, rows)=>{        
        if ( !err && (rows[0] != undefined) && (rows[0].id == id)) 
          conn.query('DELETE FROM CharacterList where cname=?', [cname], (err) => {
            if ( err ) RES[0] = '0';
            else {
              RES[0] = '1';
              console.log("correct");
            }
            resolve(0);
          }); // end of 2q
        else {
          console.log("fail");
          resolve(0);
        }
      }); // end of 1q
    }); // end of promise
  }

  
  function M(conn, id, pwd, res) {
    return new Promise((resolve, reject)=>{
      conn.query('insert into Accountlist values(?,?)', [id, pwd], (err)=>{
        if ( err ) {
          console.log("err"+err);
          res[0] = '0';
        }
        else {
          res[0] = '1';
          console.log('ok');
        }
      resolve(0);
      });  
    });
  }
  function QI(conn, id, list, res) {
    return new Promise((resolve, reject) =>{
      conn.query('select cname from CharacterList where id = ?', [id], 
      (err, rows)=>{
        if ( err) { 
          console.log(err);
          res[0] = '0'; 
        resolve(0); 
      }
        else {
          if ( rows[0] == undefined) { 
            res[0] = '0';
            resolve(0);
          }
          else{
            res[0] = '1';
          for ( var k=0; k < rows.length; k++)
            list[k] = rows[k].cname;
          resolve(0); 
        }
      }
      });
    });

  }
  function Q(conn, query, list) {
    return new Promise((resolve, reject)=>{
      conn.query(query, (err, rows)=> {
      if ( err) {
        console.log("Q err");
        resolve(0);
      }else {
        for (var k=0; k < rows.length; k++) {
        list[k] = rows[k].id;
        if (k == rows.length-1)
          resolve(0);
        }
      }
      });
    });
  }
  function QC(conn, query, list) {
    return new Promise((resolve, reject)=>{
      conn.query(query, (err, rows)=> {
      if ( err) 
        console.log("qc err"+err);
      else 
        for (var k=0; k < rows.length; k++) {
          list[k] = rows[k].cname;
          console.log("l"+list[k]);
        }
        resolve(0);
      });
    });
  }
//체크로그인
  function D(conn, list, id , pwd) {
    return new Promise((resolve, reject)=>{
      conn.query('select pwd from AccountList where id=?', [id],
      (err, rows)=> {
      if ( err) {
        console.log(err);
        list[0] = '0';
      }
      else { //잘못된 쿼리가 아닌경우
        if ( rows[0] == undefined) {
          list[0] = '0';
        }
        else {
          if (rows[0].pwd == pwd ) {
            //체크로그인 성공
            list[0] = '1';
          }
          else
            list[0] = '0';
      }
    resolve(0);
    }
      });
    });
  }

  //모든 계정리스트 담기
  function QQ(conn, list) {
    return new Promise((resolve, reject)=>{
      conn.query('select id from AccountList', (err, rows)=> {
      if ( err) {
        console.log("QQ err");
        return 0;
      }
      else {
        for (var k=0; k < rows.length; k++) {
          list[k] = rows[k].id;
  
          if (k == rows.length-1)
            resolve(0);
        }
      }
      });
    });
  }
  //모든 캐릭리스트 담기
  function QQQ(conn, list) {
    return new Promise((resolve, reject)=>{
      conn.query('select cname from CharacterList', (err, rows)=> {
      if ( err) {
        console.log('qqq err');
        return 0;
      }
      else {
        for (var k=0; k < rows.length; k++) {
          list[k] = rows[k].cname;
          if (k == rows.length-1)
            resolve(0);
        }
      }
      resolve(0);
      });
    });
  }
  module.exports = DB;