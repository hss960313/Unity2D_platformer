
function fetch_html(num) {
if ( num != 5 && num != 6)
    return new Promise(function(resolve, reject) {
      var s = '/db'+num+'.html';
      fetch(s).then(function(response) {
        response.text().then(function(text) {
          Id('showresult').innerHTML = text;
          resolve(0);
        })
      });
    });
    else {
        dbfunc(num);
    }
  }
  function dbfunc(num) {
    if ( num !=5 && num != 6)
      if ( Id('id').value == '' || Id('id').value == null) {
        return;
      }

      switch (num) {
          case 1: //newCharacter
          ClientSoc.emit('1', {
            id : Id('id').value,
            cname : Id('cname').value,
            hair : Id('hair').value,
            head : Id('head').value,
            body : Id('body').value,
            face : Id('face').value
          });
              break;
 
          case 2: //newAccount
          ClientSoc.emit('2', {
            id : Id('id').value,
            pwd : Id('pwd').value
          });
              break;
          case 3: //deleteCharacter
          ClientSoc.emit('3', {
            id : Id('id').value,
            pwd : Id('pwd').value,
            cname : Id('cname').value
          });
            break;
        case 4: //deleteAccount
          ClientSoc.emit('4', {
            id : Id('id').value,
            pwd : Id('pwd').value
          });
          break;
          case 5: //getAccountList
          ClientSoc.emit('5', '');
              break;
 
          case 6: //getAllCharacterList
          ClientSoc.emit('6', '');
              break;
          case 7: // getIdCharacterList
          ClientSoc.emit('7', Id('id').value);
              break;
          case 8: //checkLogin
          ClientSoc.emit('8',{
            id : Id('id').value,
            pwd : Id('pwd').value
          })    
          break;
        }
  }
 