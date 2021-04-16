var file= require('fs');
file.readFile('sample.txt', 'utf8', function(err, data) {
  console.log(data);
});
