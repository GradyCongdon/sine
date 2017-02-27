import { Synth } from './synth.es6';
import { UI } from './ui.es6';
import { Sequencer } from './sequencer.es6';

var audio =  window.AudioContext || window.webkitAudioContext;
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

function normal() {
  return () => {
    content.innerHTML = '';
    let notes = [ 'A4', 'Bb4', 'B4', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab5', 'A5'];
    notes.forEach(note => createSynthKey(note));
    addSequencer();
    areKeysPresent();
  }
} 

// μικρός tonal
function mikros(octaveDivisions = 31) {
  return () => {
    content.innerHTML = '';
    for (let i = 0; i < octaveDivisions; i++) {
      let freq = 440 + i * (440 / octaveDivisions);
      createSynthKey(freq);
    }
    areKeysPresent();
  }
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
}

function stopAll(event) {
  return () => {
    for (let g in synth.gains) {
      synth.gains[g].gain.value = 0;
    }
    const onKeys = Array.from(content.getElementsByClassName('on'));
    onKeys.forEach(el => el.classList.remove('on'));
  };
}

/* Not working
A. dont know how to use intervals to make loops
B. scheduled changes arent stopped by clearInterval anyway
content.appendChild(UI.makeStop(stop));
const stop = (looper) => clearInterval(looper);
*/

const micro31Button = UI.makeChoice(mikros(31), "microtuning \'31");
const micro62Button = UI.makeChoice(mikros(62), "microtuning \'62");
const micro93Button = UI.makeChoice(mikros(93), "microtuning \'93");
const normalButton = UI.makeChoice(normal(), 'normal keys');
content.appendChild(micro31Button);
content.appendChild(micro62Button);
content.appendChild(micro93Button);
content.appendChild(normalButton);
const text = document.createElement('p');
text.innerHTML= '<br/>press any key to stop sound';
content.appendChild(text);
areKeysPresent();

window.addEventListener('keypress', stopAll());


