console.log('surfin on sine waves');

const con = new AudioContext();
const out = con.destination;

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

const A4 = o(440, 'sine');
const Bb4 = o(466.16, 'sine');
const B4 = o(493.88, 'sine');
const C4 = o(493.88, 'sine');
const Db5 = o(554.37, 'sine');
const D5 = o(587.33, 'sine');
const Eb5 = o(622.25, 'sine');
const E5 = o(659.25, 'sine');
const F5 = o(698.46, 'sine');
const Gb5 = o(739.99, 'sine');
const G5 = o(783.99, 'sine');
const Ab5 = o(830.61, 'sine');
const A5 = o(880.00, 'sine');

// const A6 = o(1760.00, 'sine');

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

function makeKey(key) {
  const ivory = document.createElement('div');
  ivory.id = key;
  ivory.innerHTML = key;
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
