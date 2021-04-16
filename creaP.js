const express = require('express');
var fs = require('fs')
const app = express();
//eX.use(bodyParser.urlencoded({ extended: false}));
var res = 'fail';

app.post('/create_process', function (request, response) {
  res = request.method;
  console.log("res = "+res);
});
console.log('asd');
console.log(res);
module.exports = {
  find_res : function() {
    app.post('/create_process', function (request, response) {
      res = request.method;
      console.log("res = "+res);
    });
    return res;
  },
  find_res2 : function() {

    return res;
  }
};
