
export default class Oscillator {
  constructor(webAudio, frequency, type = 'sine') {
    const osc = webAudio.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    this.oscillator = osc;

    const gain = webAudio.ctx.createGain();
    gain.connect(webAudio.output);
    gain.gain.value = 0;
    this.gain = gain;

    osc.connect(gain);
  }

  start() {
    this.osciallator.start();
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
