console.log('surfin on sine waves');

const con = new AudioContext();
const out = con.destination;
const content = document.getElementById('content');

// AUDIO
class Synth {
  static setupOscillator(inputNote) {
    const note = inputNote;
    const freq = Convert.freqFromNote(note);
    const osc = createOscillator(freq);
    const gain = createGain();
    osc.connect(gain);
    osc.start();
    return { note, osc, gain };
  }

  static createGain() {
      const g = con.createGain();
      g.connect(out);
      g.gain.value = 0;
      return g;
  }

  static createOscillator(freq, type = 'sine') {
      const o = con.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      return o;
  }
}

const notes = [ 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'];

class Convert {

  static freqFromStep(steps, fixed = 440) {
    return fixed * (2 ** (1/12)) ** steps;
  }

  static noteFromStep(step) {
    const note = step % notes.length;
    return notes[note];
  }

  static stringToNote(str) {
    note = str.slice(0, str.length);
    octave = str.slice(str.length-1);
    return { note, octave };
  }

  static freqFromNote(inputNote) {
    if (typeof inputNote === 'String') { 
      inputNote = stringToNote(inputNote);
    }
    const { note, octave } = inputNote;
    const semi = notes.indexOf(note);
    const freq = freqFromStep(semi);
    const base = octave - 4;
    let out;
    if (base > 0) {
      out = freq * n.octave;
    } else if (base < 0) {
      out = freq / octave;
    } else {
      out = freq;
    }
    return out;
  }
}



// UI

class UI {
  static makeKey(key) {
    const ivory = document.createElement('div');
    ivory.id = key;
    ivory.innerHTML = key;
    ivory.dataset.frequency = round(t(key), 3);
    ivory.classList.add('key');
    if (key.match('b')) ivory.classList.add('ebony');
    content.appendChild(ivory);
    ivory.addEventListener('click', toggle);
  }

  static makeStep(num) {
    if (!num) throw Error ('no step number');
    const step = document.createElement('div');
    step.id = `step-${num}`;
    content.appendChild(step);
    step.addEventListener('click', sequence);
  }
}

function toggle(event) {
  const key = event.target;
  const on = key.classList.toggle('on');
  // Lookup components on target
  // Run on funcs for each
  if (on) { 
    synth[key.id].gain.gain.value = 0.5;
  } else {
    synth[key.id].gain.gain.value = 0;
  }
}

function round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

const keys = [
  'A4',
  'Bb4',
  'B4',
  'C4',
  'Db5',
  'D5',
  'Eb5',
  'E5',
  'F5',
  'Gb5',
  'G5',
  'Ab5',
  'A5',
];

let synth = [];

keys.forEach((key) => {
  const osc = Synth.setupOscillator(key);
  synth.push(osc);
  UI.makeKey(key);
});
