import { Synth } from './synth.es6';
import { UI } from './ui.es6';
import { Sequencer } from './sequencer.es6';

var audio = window.AudioContext || window.webkitAudioContext;
const audioContext = new audio();
const output = audioContext.destination;

let synth = new Synth(audioContext, output);

const content = document.getElementById('content');

/*
const filter = audioContext.createBiquadFilter();
filter.type = 'lowshelf';
filter.frequency.value = 880;
filter.gain.value = 25;
filter.connect(output);
let synth = new Synth(audioContext, filter);
*/

function createSynthKey(note) {
  synth.createNote(note);
  const action = () => {
    const on = UI.toggle(note);
    synth.toggle(note, on);
  };
  const key = UI.makeKey(note, action);
  content.appendChild(key);
}

function createSinglet(note, keyboard) {
  const syn = synth.createNote(note);
  const action = event => {
    // event.key newer prop, chrome 40 didn't have it
    if (event.key == keyboard) {
      const on = UI.toggle(note);
      synth.toggle(note, on);
    }
  };
  const ui = UI.makeSinglet(note, action, keyboard);
  return { syn, ui };
}

function normal() {
  return () => {
    content.innerHTML = '';
    let notes = [
      'A4',
      'Bb4',
      'B4',
      'C4',
      'Db4',
      'D4',
      'Eb4',
      'E4',
      'F4',
      'Gb4',
      'G4',
      'Ab5',
      'A5',
    ];
    notes.forEach(note => createSynthKey(note));
    addSequencer();
    areKeysPresent();
  };
}

// μικρός tonal
function mikros(octaveDivisions = 33) {
  return () => {
    content.innerHTML = '';
    getFreqsFromDivisions(octaveDivisions).forEach(freq =>
      createSynthKey(freq)
    );
    areKeysPresent();
  };
}

function singlets(octaveDivisions = 33) {
  return () => {
    content.innerHTML = '';
    const keyboardNode = document.createElement('div');
    keyboardNode.classList.add('keyboard');
    const freqs = getFreqsFromDivisions(octaveDivisions);
    const keyboard = getKeyboardFromDivisions(octaveDivisions);
    for (let i = 0; i < freqs.length; ) {
      let triplet = [];
      for (let j = 0; j < 3; j++) {
        const { _, ui } = createSinglet(freqs[i], keyboard[i]);
        triplet.push(ui);
        i++; // increment Outer loop
      }
      UI.makeTriplet(triplet, keyboardNode);
    }
    document.getElementById(freqs.pop()).classList.add('last-singlet');
    content.appendChild(keyboardNode);
    areKeysPresent();
  };
}

function getFreqsFromDivisions(octaveDivisions = 33) {
  const freqs = [];
  for (let i = 0; i < octaveDivisions; i++) {
    let freq = 440 + i * (440 / octaveDivisions);
    freqs.push(freq);
  }
  return freqs;
}

function getKeyboardFromDivisions(octaveDivisions = 33) {
  const keyboard = [
    'q',
    'a',
    'z',
    'w',
    's',
    'x',
    'e',
    'd',
    'c',
    'r',
    'f',
    'v',
    't',
    'g',
    'b',
    'y',
    'h',
    'n',
    'u',
    'j',
    'm',
    'i',
    'k',
    ',',
    'o',
    'l',
    '.',
    'p',
    ';',
    '/',
    '[',
    "'",
    ']',
  ];
  return keyboard;
}

function areKeysPresent() {
  if (content.childElementCount) {
    console.log('surfin on sine waves');
  } else {
    content.innerHTML = 'broke it ¯\\_(ツ)_/¯';
  }
}

function addSequencer() {
  const sequencer = new Sequencer(audioContext, 90);
  sequencer.newAction(1, synth.gains['A4'].gain, 0.6);
  sequencer.newAction(2, synth.gains['A4'].gain, 0);

  sequencer.newAction(2, synth.gains['B4'].gain, 0.6);
  sequencer.newAction(3, synth.gains['B4'].gain, 0);

  sequencer.newAction(3, synth.gains['C4'].gain, 0.6);
  sequencer.newAction(4, synth.gains['C4'].gain, 0);

  sequencer.newAction(5, synth.gains['G4'].gain, 0.6);
  sequencer.newAction(9, synth.gains['G4'].gain, 0);

  sequencer.newAction(9, synth.gains['A4'].gain, 0.6);
  sequencer.newAction(11, synth.gains['A4'].gain, 0);

  sequencer.newAction(11, synth.gains['G4'].gain, 0.6);
  sequencer.newAction(19, synth.gains['G4'].gain, 0);

  const loop = () => {
    const last = sequencer.scheduleSequence();
    const next = last * 1000;
    console.log(`next ${next}`);
  };
  content.appendChild(UI.makePlay(loop));
}

function stopAll(event) {
  for (let g in synth.gains) {
    synth.gains[g].gain.value = 0;
  }
  const onKeys = Array.from(content.getElementsByClassName('on'));
  onKeys.forEach(el => el.classList.remove('on'));
  event.preventDefault();
}

/* Not working
A. dont know how to use intervals to make loops
B. scheduled changes arent stopped by clearInterval anyway
content.appendChild(UI.makeStop(stop));
const stop = (looper) => clearInterval(looper);
*/
UI.attachMessage2U(content);
const choices = document.createElement('div');
choices.classList.add('choices');
content.appendChild(choices);

choices.appendChild(UI.makeChoice(singlets(33), "keyboard µtuning '33"));
choices.appendChild(UI.makeChoice(mikros(24), "microtuning '24"));
choices.appendChild(UI.makeChoice(mikros(50), "microtuning '50"));
choices.appendChild(UI.makeChoice(mikros(99), "microtuning '99"));
choices.appendChild(UI.makeChoice(normal(), 'normal keys'));

areKeysPresent();

const buildFilterKeys = (key, func) => {
  return event => {
    if (event.key !== key) return event;
    func(event);
  };
};

window.addEventListener('keypress', buildFilterKeys(' ', stopAll));
const onChangeRange = event => {
  stopAll(event);
  const value = event.target.value;
  range.value = value;
  divisions.value = value;
  if (value < 33) {
    singlets(value)();
  } else {
    mikros(value)();
  }
};
const range = document.getElementById('range');
const divisions = document.getElementById('divisions');
range.addEventListener('change', onChangeRange);
divisions.addEventListener('change', onChangeRange);
