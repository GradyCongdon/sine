
export default class Oscillator {
  constructor(audio, frequency, type = 'sine') {
    const osc = audio.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    this.oscillator = osc;

    const gain = audio.ctx.createGain();
    gain.connect(audio.output);
    gain.gain.value = 0;
    this.gain = gain;

    osc.connect(gain);
    osc.start();
  }

  get volume() {
    return this.gain.value;
  }

  set volume(volume) {
    this.gain.value = volume;
  }

  on(volume = 0.5) {
    this.gain.value = volume;
  }

  off() {
    this.gain.value = 0;
  }
}
