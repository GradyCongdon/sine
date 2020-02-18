
export default class Oscillator {
  constructor(webAudio, frequency, type = 'sine') {
    const osc = webAudio.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    this.oscillator = osc;
    this.statrted = false;

    const gain = webAudio.ctx.createGain();
    gain.connect(webAudio.output);
    gain.gain.value = 0;
    this.gain = gain;

    osc.connect(gain);
  }

  start() {
    this.oscillator.start();
    this.started = true;
  }

  get volume() {
    return this.gain.value;
  }

  set volume(volume) {
    this.gain.value = volume;
  }

  on(volume = 0.5) {
    if (!this.started) this.start();
    this.gain.value = volume;
  }

  off() {
    this.gain.value = 0;
  }
}
