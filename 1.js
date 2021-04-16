window.onload = function() {
  var header = document.getElementById('t1');
  // header 객체에 onclick 이벤트 속성을 연결
  header.onclick = function() { alert('클릭');
  // 이벤트를 제거, 한번만 실행이 됨
  header.onclick = null;
  }
};
