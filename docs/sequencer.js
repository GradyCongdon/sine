'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sequencer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _step = require('./step.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sequencer = exports.Sequencer = function () {
  function Sequencer(audioContext) {
    var bpm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 120;

    _classCallCheck(this, Sequencer);

    this.context = audioContext;
    this.bpm = bpm;
    this.stepCount = 0;
    this.sequenceLength = 16; // fixed TODO
    this.beatsPerSequence = 4; // fixed TODO
    // bpm / 60 = beats per sec
    var bps = this.bpm / 60;
    // bps * steps/beat = steps per sec
    var stps = bps * (this.sequenceLength / this.beatsPerSequence);
    // sps ** -1 = sec per step
    this.secPerStep = Math.pow(stps, -1);
    this.lastScheduledTime = 0;
    this.sequence = Array(this.sequenceLength);
  }

  _createClass(Sequencer, [{
    key: 'run',
    value: function run() {
      var restartTime = this.lastScheduledTime - this.currentTime();
      if (restartTime < 0) {
        restartTime = 0;
      }
      // TODO PERF latency very possible with setTimeout
      // Would like callback on schedule finished to run another instance of scheduleSequence
      window.setTimeout(this.scheduleSequence, restartTime);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.sequence.forEach(function (step) {
        step.forEach(function (action) {
          action.target.cancelScheduledValues();
        });
      });
      return self;
    }
  }, {
    key: 'newAction',
    value: function newAction(sequenceNumber, target, value) {
      if (sequenceNumber < 0 || sequenceNumber > this.sequence.length) return null;

      var step = this.sequence[sequenceNumber];
      // Check if we need to initialize a step before adding actions
      if (!(step instanceof _step.Step)) {
        step = new _step.Step();
      }

      step.newAction(target, value);
      return self;
    }
  }, {
    key: 'scheduleSequence',
    value: function scheduleSequence() {
      var schedule = Array(this.sequenceLength);
      for (var s = 0; s < this.sequenceLength - 1; s++) {
        // Schedule each step of a sequence ~sequentially~
        var time = this.calculateStepRunTime(s);
        if (!time) break;
        schedule.push(time);

        // have step schedule it's actions
        var step = this.sequence[s];
        step.scheduleActions(time);
        // TODO HIGH might need setTimeOut to call other actions at time, but might be off
      }
      this.lastScheduledTime = schedule.slice(-1) || 0;
      return schedule; // Could be used for scheduling restart, but should be removed if not
      // return self;
    }
  }, {
    key: 'currentTime',
    value: function currentTime() {
      return this.context.currentTime;
    }
  }, {
    key: 'getStepCount',
    value: function getStepCount(sequenceNumber) {
      return this.stepCount + sequenceNumber;
    }
  }, {
    key: 'getCurrentSequence',
    value: function getCurrentSequence() {
      return this.stepCount % this.sequenceLength;
    }
  }, {
    key: 'calculateStepRunTime',
    value: function calculateStepRunTime(stepNumber) {
      if (stepNumber <= 0 || stepNumber < this.stepCount) return null;
      return this.currentTime() + stepNumber * this.secPerStep;
    }
  }]);

  return Sequencer;
}();