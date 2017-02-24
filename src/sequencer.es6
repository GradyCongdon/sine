import { Step } from './step.es6';

export class Sequencer {
  constructor(audioContext, bpm = 120) {
    this.context = audioContext;
    this.bpm = bpm;
    this.stepCount = 0;
    this.sequenceLength = 16; // fixed TODO
    this.beatsPerSequence = 4; // fixed TODO
    // bpm / 60 = beats per sec
    const bps = this.bpm / 60;
    // bps * steps/beat = steps per sec
    const stps = bps * (this.sequenceLength / this.beatsPerSequence);
    // sps ** -1 = sec per step
    this.secPerStep = Math.pow(stps, -1);
    this.lastScheduledTime = 0;
    this.sequence = Array(this.sequenceLength);
  }
  run() {
    let restartTime = this.lastScheduledTime - this.currentTime();
    if (restartTime < 0) {
      restartTime = 0;
    }
    // TODO PERF latency very possible with setTimeout
    // Would like callback on schedule finished to run another instance of scheduleSequence
    window.setTimeout(this.scheduleSequence, restartTime);
  }

  stop() {
    this.sequence.forEach(step => {
      step.forEach(action => {
        action.target.cancelScheduledValues();
      });
    });
    return self;
  }

  newAction(sequenceNumber, target, value) {
    if ((sequenceNumber < 0) || (sequenceNumber > this.sequence.length)) return null;

    let step = this.sequence[sequenceNumber];
    // Check if we need to initialize a step before adding actions
    if (!(step instanceof Step)) {
      step = new Step();
    }

    step.newAction(target, value);
    return self;
  }

  scheduleSequence() {
    const schedule = Array(this.sequenceLength);
    for (let s = 0; s < this.sequenceLength - 1; s++) {
      // Schedule each step of a sequence ~sequentially~
      const time = this.calculateStepRunTime(s);
      if (!time) break;
      schedule.push(time);

      // have step schedule it's actions
      const step = this.sequence[s];
      step.scheduleActions(time);
      // TODO HIGH might need setTimeOut to call other actions at time, but might be off
    }
    this.lastScheduledTime = schedule.slice(-1) || 0;
    return schedule; // Could be used for scheduling restart, but should be removed if not
    // return self;
  }
  currentTime() {
    return this.context.currentTime;
  }

  getStepCount(sequenceNumber) {
    return this.stepCount + sequenceNumber;
  }

  getCurrentSequence() {
    return this.stepCount % this.sequenceLength;
  }

  calculateStepRunTime(stepNumber) {
    if ((stepNumber <= 0) || (stepNumber < this.stepCount)) return null;
    return this.currentTime() + (stepNumber * this.secPerStep);
  }
}

