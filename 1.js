var list = {};
var small = {};
small['color'] = 'red';
small['role'] = 'Chaos';
list['asd'] = [];

list['asd'].push(small);
small['color'] = 'red';
small['role'] = '';
list['asd'].push(small);

var obj_length = Object.keys(list['asd']).length;
console.log(obj_length);
console.log(list['asd'][0].color);
list['asd'] = [];
console.log(list['asd']);
