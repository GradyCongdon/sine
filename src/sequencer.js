import { Step } from './step.js';

export class Sequencer {
  constructor(audioContext, bpm = 120) {
    this.context = audioContext;
    this.bpm = bpm;
    this.stepCount = 0;
    this.sequenceLength = 24; // fixed TODO
    this.beatsPerSequence = 4; // fixed TODO
    // bpm / 60 = beats per sec
    const bps = this.bpm / 60;
    // bps * steps/beat = steps per sec
    const stps = bps * (this.sequenceLength / this.beatsPerSequence);
    // sps ** -1 = sec per step
    this.secPerStep = Math.pow(stps, -1);
    this.lastScheduledTime = 0;
    this.sequence = Array(this.sequenceLength);
    this.looping = false;
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
  loop() {
    this.looping = true;
    this.scheduleSequence(); // schedule next loop & write lastScheduledTime
  }

  stop() {
    this.sequence.forEach(step => {
      step.forEach(action => {
        action.target.cancelScheduledValues();
      });
    });
    return self;
  }
  boundStep(sequenceNumber) {
    if (sequenceNumber < 0 || sequenceNumber > this.sequenceLength) {
      sequenceNumber = Math.round(sequenceNumber % this.sequenceLength);
    }
    return sequenceNumber;
  }
  addStep(sequenceNumber, target, value) {
    sequenceNumber = this.boundStep(sequenceNumber);
    const step = new Step(target, value);
    this.sequence[sequenceNumber] = step;
    return step; // FIXME maybe self instead to chain 
  }
  getStep(sequenceNumber) {
    sequenceNumber = this.boundStep(sequenceNumber);
    return this.sequence[sequenceNumber];
  }

  newAction(sequenceNumber, target, value) {
    if ((sequenceNumber < 0) || (sequenceNumber > this.sequence.length)) return null;

    let step = this.sequence[sequenceNumber];
    // Check if we need to initialize a step before adding actions
    if (!(step instanceof Step)) {
      step = this.addStep(sequenceNumber);
    }

    step.newAction(target, value);
    return self;
  }

  scheduleSequence(skip = false) {
    const schedule = Array(this.sequenceLength);
    for (let s = 0; s < this.sequenceLength - 1; s++) {
      // Schedule each step of a sequence ~sequentially~
      const time = this.calculateStepRunTime(s);
      if (!time) continue;
      schedule.push(time);
      if (skip) continue;

      // have step schedule it's actions
      const step = this.sequence[s];
      try {
        step.scheduleActions(time);
      } catch (e) {
        //skip
      }
      // TODO HIGH might need setTimeOut to call other actions at time, but might be off
    }
    this.lastScheduledTime = schedule.slice(-1)[0] || 0;

    return this.lastScheduledTime; // Could be used for scheduling restart, but should be removed if not
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
    if (stepNumber < 0)return null;
    // if ((stepNumber <= 0) || (stepNumber < this.stepCount)) return null;
    return this.currentTime() + (stepNumber * this.secPerStep);
  }
}

