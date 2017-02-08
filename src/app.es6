import { Sequencer } from './sequencer.js';
import { Synth } from './synth.js';
import { Convert } from './convert.js';
import { UI } from './ui.js';

const con = new AudioContext();
const seq = new Sequencer(con, 120);
const gain = con.creatGain();
seq.addAction(0, gain, 1);


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
const content = document.getElementById('content');

keys.forEach((key) => {
  const osc = Synth.setupOscillator(key);
  synth.push(osc);
  content.appendChild(UI.makeKey(key));
});

console.log('surfin on sine waves');
