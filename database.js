var mysql = require('mysql');
var db_info = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'sk!@3tkffleh',
    database: 'hss',
    insecureAuth: true
}

module.exports = {
    init: function () {
        //print(mysql.createConnection(db_info));
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}