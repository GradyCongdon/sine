import { Synth } from './synth.es6';
import { UI } from './ui.es6';
// import { Sequencer } from './sequencer.es6';

var audio =  window.AudioContext || window.webkitAudioContext;
const audioContext = new audio();
const output = audioContext.destination;

// const sequencer = new Sequencer(audioContext, 120);
// const gain = audioContext.createGain();
// sequencer.newAction(0, gain, 1);


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

let synth = new Synth(audioContext, output);
const content = document.getElementById('content');

notes.forEach((note) => {
  synth.createNote(note);
  const action = () => {
    const on = UI.toggle(note);
    synth.toggle(note, on);
  };
  const key = UI.makeKey(note, action);
  content.appendChild(key);
});

if (content.childElementCount) {
  console.log('surfin on sine waves');
} else {
  content.innerHTML = 'broke it ¯\\_(ツ)_/¯';
}

