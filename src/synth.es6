import { Convert } from './convert.es6';
export class Synth {
  constructor(context, output) {
    this.audioContext = context;
    this.output = output;
    this.oscillators = {};
    this.gains = {};
  }
  createNote(inputNote) {
    let freq;
    if (typeof inputNote === 'number') {
      freq = inputNote;
    } else {
      freq = Convert.freqFromNote(inputNote);
    }
    const osc = this.createOscillator(freq);
    const gain = this.createGain();
    osc.connect(gain);
    osc.start();
    this.oscillators[inputNote] = osc;
    this.gains[inputNote] = gain;
  }

  createGain() {
    const g = this.audioContext.createGain();
    g.connect(this.output);
    g.gain.value = 0;
    return g;
  }

  createOscillator( freq, type = 'sine') {
    const o = this.audioContext.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    return o;
  }
  toggle(key, on) {
    if (on) {
      this.on(key);
    } else {
      this.off(key);
    }
  }
  on(key, volume = 0.5) {
    this.gains[key].gain.value = volume;
  }
  off(key) {
    this.gains[key].gain.value = 0;
  }
}
