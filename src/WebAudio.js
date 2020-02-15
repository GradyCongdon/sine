export default class WebAudio {
  constructor() {
    console.log('WebAudio');
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.output = ctx.destination;
  }
}
