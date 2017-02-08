export class Synth {
  static setupOscillator(inputNote) {
    const note = inputNote;
    const freq = Convert.freqFromNote(note);
    const osc = createOscillator(freq);
    const gain = createGain();
    osc.connect(gain);
    osc.start();
    return { note, osc, gain };
  }

  static createGain() {
      const g = con.createGain();
      g.connect(out);
      g.gain.value = 0;
      return g;
  }

  static createOscillator(freq, type = 'sine') {
      const o = con.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      return o;
  }
}
