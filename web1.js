var express = require('express');
var app = express();
var db_config = require(__dirname + '/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');

db_config.connect(conn);

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/', function (req, res) {
    res.send('ROOT');
});

app.get('/list', function (req, res) {
    var sql = 'SELECT * FROM hssPractice';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('showlist.ejs', {list : rows});
    });
});

app.get('/write', function (req, res) {
    res.render('write.ejs');
});

app.post('/writeAf', function (req, res) {
    var body = req.body;
    console.log(body);

    var sql = 'INSERT INTO hssPractice VALUES(?, ?, ?)';
    var params = [body.id, body.title, body.content];
    console.log(sql);
    conn.query(sql, params, function(err) {
        if(err) console.log('query is not excuted. insert fail...\n' + err);
        else res.redirect('/list');
    });
});

app.listen(8080, () => console.log('Server is running on port 8080...'));