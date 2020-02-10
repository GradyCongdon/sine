export default class Audio {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.output = ctx.destination;
  }
}
