console.log('surfin on sine waves');

const con = new AudioContext();
const out = con.destination;

const A4 = o(f(0));
const Bb4 = o(f(1));
const B4 = o(f(2));
const C4 = o(f(3));
const Db5 = o(f(4));
const D5 = o(f(5));
const Eb5 = o(f(6));
const E5 = o(f(7));
const F5 = o(f(8));
const Gb5 = o(f(9));
const G5 = o(f(10));
const Ab5 = o(f(11));
const A5 = o(f(12));

const oscs = {
  A4,
  Bb4,
  B4,
  C4,
  Db5,
  D5,
  Eb5,
  E5,
  F5,
  Gb5,
  G5,
  Ab5,
  A5,
};

const content = document.getElementById('content');

Object.keys(oscs).forEach((key) => {
  const note = oscs[key]
  const o = note.o;
  const g = note.g;
  o.start();
  g.gain.value = 0;
  makeKey(key);

});

function gain() {
    const g = con.createGain();
    g.connect(out);
    return g;
}

function o(freq, type = 'sine') {
    const o = con.createOscillator();
    o.type = type;
    o.frequency.value = freq;

    const g = gain();
    o.connect(g);

    return {o, g};
}

function f(steps, fixed = 440) {
  return fixed * (2 ** (1/12)) ** steps
}

function n(step) {
  const notes = [ 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'];
  const note = step % 12
  return notes[note];
}

function t(tone) {
  const notes = [ 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'];
  const match = tone.match(/\d/);
  let note;
  let octave = 0;
  if (match) {
    octave = Number(match[0]);
    note = tone.slice(0, match.index);
  } else {
    note = tone;
  }
  const semi = notes.indexOf(note);
  // const steps = (octave - 4) + semi; TODO Wrong
  return f(semi);
}

function makeKey(key) {
  const ivory = document.createElement('div');
  ivory.id = key;
  ivory.innerHTML = key;
  ivory.dataset.frequency = round(t(key), 3);
  ivory.classList.add('key');
  if (key.match('b')) ivory.classList.add('ebony');
  content.appendChild(ivory);
  ivory.addEventListener('click', toggle);
}

function toggle(event) {
  const key = event.target;
  const on = key.classList.toggle('on');
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
