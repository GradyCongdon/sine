import { Synth } from './synth.js';
import { UI } from './ui.js';
import { Sequencer } from './sequencer.js';

var audio = window.AudioContext || window.webkitAudioContext;
const audioContext = new audio();
const output = audioContext.destination;

let synth = new Synth(audioContext, output);

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

export function createSinglet(note, keyboard) {
  const syn = synth.createNote(note);
  const on = event => {
    // event.key newer prop, chrome 40 didn't have it
    if (event.key === keyboard) {
      const on = UI.toggle(note);
      synth.toggle(note, on);
    }
  };
  const off = event => {};
  const ui = UI.makeSinglet(note, on, off, keyboard);
  return { syn, ui };
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


/* Not working
A. dont know how to use intervals to make loops
B. scheduled changes arent stopped by clearInterval anyway
content.appendChild(UI.makeStop(stop));
const stop = (looper) => clearInterval(looper);
*/
export function setup() {
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
}

