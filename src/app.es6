import { Synth } from './synth.es6';
import { UI } from './ui.es6';
import { Sequencer } from './sequencer.es6';

var audio =  window.AudioContext || window.webkitAudioContext;
const audioContext = new audio();

const output = audioContext.destination;
const sequencer = new Sequencer(audioContext, 90);

const filter = audioContext.createBiquadFilter();
filter.type = 'lowshelf';
filter.frequency.value = 440;
filter.gain.value = 25;
filter.connect(output);



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

let synth = new Synth(audioContext, filter);
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

sequencer.newAction(1, synth.gains['A4'].gain, 1);
sequencer.newAction(2, synth.gains['A4'].gain, 0);

sequencer.newAction(2, synth.gains['B4'].gain, 1);
sequencer.newAction(3, synth.gains['B4'].gain, 0);

sequencer.newAction(3, synth.gains['C4'].gain, 1);
sequencer.newAction(4, synth.gains['C4'].gain, 0);

sequencer.newAction(5, synth.gains['G4'].gain, 1);
sequencer.newAction(9, synth.gains['G4'].gain, 0);

sequencer.newAction(9, synth.gains['A4'].gain, 1);
sequencer.newAction(11, synth.gains['A4'].gain, 0);

sequencer.newAction(11, synth.gains['G4'].gain, 1);
sequencer.newAction(19, synth.gains['G4'].gain, 0);

const loop = () => {
  const last = sequencer.scheduleSequence();
  const next = last * 1000;
  console.log(`next ${next}`)
};
content.appendChild(UI.makePlay(loop));

/* Not working
A. dont know how to use intervals to make loops
B. scheduled changes arent stopped by clearInterval anyway
content.appendChild(UI.makeStop(stop));
const stop = (looper) => clearInterval(looper);
*/

