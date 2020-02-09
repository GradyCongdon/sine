import { freqFromNote } from './convert.js';

export class Synth {
  constructor(ctx, output) {
    this.audio = new SynthAudio(ctx, output);
  }

  createNote(note) {
    this.audio.createNote(note);
    const { on, off } = createNoteActions(note);

    return {
      name: note,
      on, 
      off
    };
  }
}


export class SynthAudio {

  constructor(context, output) {
    this.audioContext = context;
    this.output = output;
    this.notes = [];
    this.oscillators = {};
    this.gains = {};
  }

  createNote(note) {
    let freq;
    if (typeof note === 'number') {
      freq = note;
    } else {
      freq = freqFromNote(note);
    }

    const osc = this.createOscillator(freq);
    const gain = this.createGain();
    osc.connect(gain);
    osc.start();

    this.oscillators[note] = osc;
    this.gains[note] = gain;
    this.notes.push(note);;

  }

  createNoteActions(note) {
    const on = event => {
      // event.key newer prop, chrome 40 didn't have it
      if (event.key === keyboard) {
        synth.toggle(note, on);
      }
    };

    const off = event => {};

    return {
      on,
      off,
    };
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
