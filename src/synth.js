import Note from './Note';

const keys = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','p','q','r','s','t','u','v','w','x','y','z'];
const getKey = (l) => {
  let i = 0;
  if (l > 0) {
    i = l - 1;
  }
  if (i < keys.length) {
    return keys[i];
  }
  throw new Error('long key');
  // TODO long ones
  // const key = [];
  // while (i > keys.length)
}

export default class Synth {
  constructor(audio) {
    this.audio = audio;
    this.notes = [];
  }


  createNotes(freqencies) {
    const notes = [];
    for (let i = 0; i < freqencies.length; i++) {
      const freq = freqencies[i];
      const key = getKey(this.notes.length);
      const n = new Note(key, this.audio, freq);
      notes.push(n);
    }

    this.notes = notes;
    return notes;
  }
}
