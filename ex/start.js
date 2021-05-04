
    function OK() {
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
    }

    function OK2() {
      var modal = document.getElementById('myModal');
      modal.style.display = "none";
    }
    function OK3() {
      document.getElementById('modalContent').innerHTML = "선택된 색 : <span style='background-color : red;'>　</span><p><input type='radio' name='g3' onclick='func2()'>알파<p>\
      <input type='radio' name='g3'>베타<p>\
      <input type='radio' name='g3'>카오스<p>\
      <input type='radio' name='g3'>큐<p>\
      <input type='radio' name='g3'>브이<p>\
      <input type='radio' name='g3'>이브<p>\
      <input type='radio' name='g3'>루비<p>\
      <input type='radio' name='g3'>테토<p>\    <button id='submit' onclick='OK2();' disabled>제출</button><button id='submit' onclick='OK2();' style='float : right;'>사용취소</button>";
    }
    function OK4() {

    }
    function func2() {
      document.getElementById('submit').disabled = false;
    }
    function openContent() {
      document.getElementById('content').innerHTML = "<h2>당신은 알파(Alpha) 입니다</h2><h3>당신은 범인측의 리더로서 만약 당신이 검거되거나 죽게 되는경우 게임에서 패배합니다.</h3><h5> 탐정측의 캐릭터(Q, 브이, 이브, 루비,테토)를 모두 심판하거나, 탐정측이 검거를 실패할시 당신은 승리합니다.</h5>";
    }
    function closeContent() {
      document.getElementById('content').innerHTML = ''
    }
     function func(color) {
      s = document.getElementsByName('rGroup');
      for ( let i=0; i < s.length; i++) {
        if ( s[i].checked == true) {
          document.getElementById('next').disabled = false;
        }
      }
    };
    document.getElementsByName('rGroup').onclick = function() {
      s = document.getElementsByName('rGroup');
      for ( let i=0; i < s.length; i++) {
        if ( s[i].checked == true)
          document.getElementById('next').disabled = false;
      }
    };
    function helpOn() {
      document.getElementById('helpDiv').style.display = "block";
    }
    function helpOff() {
      document.getElementById('helpDiv').style.display = "none";
    }
