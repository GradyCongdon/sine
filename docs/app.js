'use strict';

console.log('surfin on sine waves');

var con = new AudioContext();
var out = con.destination;

function gain() {
  var g = con.createGain();
  g.connect(out);
  return g;
}

function o(freq) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sine';

  var o = con.createOscillator();
  o.type = type;
  o.frequency.value = freq;

  var g = gain();
  o.connect(g);

  return { o: o, g: g };
}

var A4 = o(440, 'sine');
var Bb4 = o(466.16, 'sine');
var B4 = o(493.88, 'sine');
var C4 = o(493.88, 'sine');
var Db5 = o(554.37, 'sine');
var D5 = o(587.33, 'sine');
var Eb5 = o(622.25, 'sine');
var E5 = o(659.25, 'sine');
var F5 = o(698.46, 'sine');
var Gb5 = o(739.99, 'sine');
var G5 = o(783.99, 'sine');
var Ab5 = o(830.61, 'sine');
var A5 = o(880.00, 'sine');

// const A6 = o(1760.00, 'sine');

var oscs = {
  A4: A4,
  Bb4: Bb4,
  B4: B4,
  C4: C4,
  Db5: Db5,
  D5: D5,
  Eb5: Eb5,
  E5: E5,
  F5: F5,
  Gb5: Gb5,
  G5: G5,
  Ab5: Ab5,
  A5: A5
};

var content = document.getElementById('content');

Object.keys(oscs).forEach(function (key) {
  var note = oscs[key];
  var o = note.o;
  var g = note.g;
  o.start();
  g.gain.value = 0;
  makeKey(key);
});

function makeKey(key) {
  var ivory = document.createElement('div');
  ivory.id = key;
  ivory.innerHTML = key;
  ivory.classList.add('key');
  if (key.match('b')) ivory.classList.add('ebony');
  content.appendChild(ivory);
  ivory.addEventListener('click', toggle);
}

function toggle(event) {
  var key = event.target;
  var on = key.classList.toggle('on');
  if (on) {
    oscs[key.id].g.gain.value = 0.5;
  } else {
    oscs[key.id].g.gain.value = 0;
  }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5lczYiXSwibmFtZXMiOlsiY29uc29sZSIsImxvZyIsImNvbiIsIkF1ZGlvQ29udGV4dCIsIm91dCIsImRlc3RpbmF0aW9uIiwiZ2FpbiIsImciLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsIm8iLCJmcmVxIiwidHlwZSIsImNyZWF0ZU9zY2lsbGF0b3IiLCJmcmVxdWVuY3kiLCJ2YWx1ZSIsIkE0IiwiQmI0IiwiQjQiLCJDNCIsIkRiNSIsIkQ1IiwiRWI1IiwiRTUiLCJGNSIsIkdiNSIsIkc1IiwiQWI1IiwiQTUiLCJvc2NzIiwiY29udGVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsIm5vdGUiLCJzdGFydCIsIm1ha2VLZXkiLCJpdm9yeSIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsImlubmVySFRNTCIsImNsYXNzTGlzdCIsImFkZCIsIm1hdGNoIiwiYXBwZW5kQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlIiwiZXZlbnQiLCJ0YXJnZXQiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsR0FBUixDQUFZLHNCQUFaOztBQUVBLElBQU1DLE1BQU0sSUFBSUMsWUFBSixFQUFaO0FBQ0EsSUFBTUMsTUFBTUYsSUFBSUcsV0FBaEI7O0FBRUEsU0FBU0MsSUFBVCxHQUFnQjtBQUNaLE1BQU1DLElBQUlMLElBQUlNLFVBQUosRUFBVjtBQUNBRCxJQUFFRSxPQUFGLENBQVVMLEdBQVY7QUFDQSxTQUFPRyxDQUFQO0FBQ0g7O0FBRUQsU0FBU0csQ0FBVCxDQUFXQyxJQUFYLEVBQWdDO0FBQUEsTUFBZkMsSUFBZSx1RUFBUixNQUFROztBQUM1QixNQUFNRixJQUFJUixJQUFJVyxnQkFBSixFQUFWO0FBQ0FILElBQUVFLElBQUYsR0FBU0EsSUFBVDtBQUNBRixJQUFFSSxTQUFGLENBQVlDLEtBQVosR0FBb0JKLElBQXBCOztBQUVBLE1BQU1KLElBQUlELE1BQVY7QUFDQUks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d2F2ZXMnKTtcblxuY29uc3QgY29uID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuY29uc3Qgb3V0ID0gY29uLmRlc3RpbmF0aW9uO1xuXG5mdW5jdGlvbiBnYWluKCkge1xuICAgIGNvbnN0IGcgPSBjb24uY3JlYXRlR2FpbigpO1xuICAgIGcuY29ubmVjdChvdXQpO1xuICAgIHJldHVybiBnO1xufVxuXG5mdW5jdGlvbiBvKGZyZXEsIHR5cGUgPSAnc2luZScpIHtcbiAgICBjb25zdCBvID0gY29uLmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICBvLnR5cGUgPSB0eXBlO1xuICAgIG8uZnJlcXVlbmN5LnZhbHVlID0gZnJlcTtcblxuICAgIGNvbnN0IGcgPSBnYWluKCk7XG4gICAgby5jb25uZWN0KGcpO1xuXG4gICAgcmV0dXJuIHtvLCBnfTtcbn1cblxuY29uc3QgQTQgPSBvKDQ0MCwgJ3NpbmUnKTtcbmNvbnN0IEJiNCA9IG8oNDY2LjE2LCAnc2luZScpO1xuY29uc3QgQjQgPSBvKDQ5My44OCwgJ3NpbmUnKTtcbmNvbnN0IEM0ID0gbyg0OTMuODgsICdzaW5lJyk7XG5jb25zdCBEYjUgPSBvKDU1NC4zNywgJ3NpbmUnKTtcbmNvbnN0IEQ1ID0gbyg1ODcuMzMsICdzaW5lJyk7XG5jb25zdCBFYjUgPSBvKDYyMi4yNSwgJ3NpbmUnKTtcbmNvbnN0IEU1ID0gbyg2NTkuMjUsICdzaW5lJyk7XG5jb25zdCBGNSA9IG8oNjk4LjQ2LCAnc2luZScpO1xuY29uc3QgR2I1ID0gbyg3MzkuOTksICdzaW5lJyk7XG5jb25zdCBHNSA9IG8oNzgzLjk5LCAnc2luZScpO1xuY29uc3QgQWI1ID0gbyg4MzAuNjEsICdzaW5lJyk7XG5jb25zdCBBNSA9IG8oODgwLjAwLCAnc2luZScpO1xuXG4vLyBjb25zdCBBNiA9IG8oMTc2MC4wMCwgJ3NpbmUnKTtcblxuY29uc3Qgb3NjcyA9IHtcbiAgQTQsXG4gIEJiNCxcbiAgQjQsXG4gIEM0LFxuICBEYjUsXG4gIEQ1LFxuICBFYjUsXG4gIEU1LFxuICBGNSxcbiAgR2I1LFxuICBHNSxcbiAgQWI1LFxuICBBNSxcbn07XG5cbmNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xuXG5PYmplY3Qua2V5cyhvc2NzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgY29uc3Qgbm90ZSA9IG9zY3Nba2V5XVxuICBjb25zdCBvID0gbm90ZS5vO1xuICBjb25zdCBnID0gbm90ZS5nO1xuICBvLnN0YXJ0KCk7XG4gIGcuZ2Fpbi52YWx1ZSA9IDA7XG4gIG1ha2VLZXkoa2V5KTtcblxufSk7XG5cbmZ1bmN0aW9uIG1ha2VLZXkoa2V5KSB7XG4gIGNvbnN0IGl2b3J5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGl2b3J5LmlkID0ga2V5O1xuICBpdm9yeS5pbm5lckhUTUwgPSBrZXk7XG4gIGl2b3J5LmNsYXNzTGlzdC5hZGQoJ2tleScpO1xuICBpZiAoa2V5Lm1hdGNoKCdiJykpIGl2b3J5LmNsYXNzTGlzdC5hZGQoJ2Vib255Jyk7XG4gIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaXZvcnkpO1xuICBpdm9yeS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZSk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZShldmVudCkge1xuICBjb25zdCBrZXkgPSBldmVudC50YXJnZXQ7XG4gIGNvbnN0IG9uID0ga2V5LmNsYXNzTGlzdC50b2dnbGUoJ29uJyk7XG4gIGlmIChvbikgeyBcbiAgICBvc2NzW2tleS5pZF0uZy5nYWluLnZhbHVlID0gMC41O1xuICB9IGVsc2Uge1xuICAgIG9zY3Nba2V5LmlkXS5nLmdhaW4udmFsdWUgPSAwO1xuICB9XG59XG4iXX0=
