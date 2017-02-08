'use strict';

console.log('surfin on sine waves');

var con = new AudioContext();
var out = con.destination;

var A4 = o(f(0));
var Bb4 = o(f(1));
var B4 = o(f(2));
var C4 = o(f(3));
var Db5 = o(f(4));
var D5 = o(f(5));
var Eb5 = o(f(6));
var E5 = o(f(7));
var F5 = o(f(8));
var Gb5 = o(f(9));
var G5 = o(f(10));
var Ab5 = o(f(11));
var A5 = o(f(12));

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

function f(steps) {
  var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 440;

  return fixed * Math.pow(Math.pow(2, 1 / 12), steps);
}

function n(step) {
  var notes = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'];
  var note = step % 12;
  return notes[note];
}

function t(tone) {
  var notes = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'];
  var match = tone.match(/\d/);
  var note = void 0;
  var octave = 0;
  if (match) {
    octave = Number(match[0]);
    note = tone.slice(0, match.index);
  } else {
    note = tone;
  }
  var semi = notes.indexOf(note);
  // const steps = (octave - 4) + semi; TODO Wrong
  return f(semi);
}

function makeKey(key) {
  var ivory = document.createElement('div');
  ivory.id = key;
  ivory.innerHTML = key;
  ivory.dataset.frequency = round(t(key), 3);
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

function round(number, precision) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};