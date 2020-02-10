import { freqFromNote } from './convert';
import { getFreqsFromDivisions, getKeyboardFromDivisions } from './util';

export class SynthAudio {

  constructor(context, output) {
    this.audioContext = context;
    this.output = output;
    this.notes = [];
    this.oscillators = {};
    this.gains = {};
  }

  buildFromDivisions(octaveDivisions) {
    const freqs = getFreqsFromDivisions(octaveDivisions);
    const notes = createNotes(freqs);
  }

  createNotes(freqencies) {
    const notes = [];
    for (let i = 0; i < freqencies.length; i++) {
      const freq = freqencies[i];
      const { on, off } = this.createNote(freq);
      const n = {
        frequency: freq,
        on,
        off,
      }
      notes.push(n);
    }

    return notes;
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

    const { on, off } = createNoteActions(note);
    return {
      on, 
      off
    };

  }

  createNoteActions(note) {
    const on = event => {
      if (event.key === keyboard) {
        this.toggle(note, on);
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
