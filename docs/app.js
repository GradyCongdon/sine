(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _synth = require('./synth.es6');

var _ui = require('./ui.es6');

var _sequencer = require('./sequencer.es6');

var audio = window.AudioContext || window.webkitAudioContext;
var audioContext = new audio();

var output = audioContext.destination;
var sequencer = new _sequencer.Sequencer(audioContext, 90);

var filter = audioContext.createBiquadFilter();
filter.type = 'lowshelf';
filter.frequency.value = 440;
filter.gain.value = 25;
filter.connect(output);

var notes = ['A4', 'Bb4', 'B4', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab5', 'A5'];

var synth = new _synth.Synth(audioContext, filter);
var content = document.getElementById('content');

notes.forEach(function (note) {
  synth.createNote(note);
  var action = function action() {
    var on = _ui.UI.toggle(note);
    synth.toggle(note, on);
  };
  var key = _ui.UI.makeKey(note, action);
  content.appendChild(key);
});

if (content.childElementCount) {
  console.log('surfin on sine waves');
} else {
  content.innerHTML = 'broke it ¯\\_(ツ)_/¯';
}

sequencer.newAction(1, synth.gains['A4'].gain, 1);
sequencer.newAction(2, synth.gains['A4'].gain, 0);

sequencer.newAction(2, synth.gains['B4'].gain, 1);
sequencer.newAction(3, synth.gains['B4'].gain, 0);

sequencer.newAction(3, synth.gains['C4'].gain, 1);
sequencer.newAction(4, synth.gains['C4'].gain, 0);

sequencer.newAction(5, synth.gains['G4'].gain, 1);
sequencer.newAction(9, synth.gains['G4'].gain, 0);

sequencer.newAction(9, synth.gains['A4'].gain, 1);
sequencer.newAction(11, synth.gains['A4'].gain, 0);

sequencer.newAction(11, synth.gains['G4'].gain, 1);
sequencer.newAction(19, synth.gains['G4'].gain, 0);

var loop = function loop() {
  var last = sequencer.scheduleSequence();
  var next = last * 1000;
  console.log('next ' + next);
};
content.appendChild(_ui.UI.makePlay(loop));

/* Not working
A. dont know how to use intervals to make loops
B. scheduled changes arent stopped by clearInterval anyway
content.appendChild(UI.makeStop(stop));
const stop = (looper) => clearInterval(looper);
*/

},{"./sequencer.es6":3,"./synth.es6":5,"./ui.es6":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var notes = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'];

var Convert = exports.Convert = function () {
  function Convert() {
    _classCallCheck(this, Convert);
  }

  _createClass(Convert, null, [{
    key: 'freqFromStep',
    value: function freqFromStep(steps) {
      var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 440;

      var a = Math.pow(2, 1 / 12);
      return fixed * Math.pow(a, steps);
    }
  }, {
    key: 'noteFromStep',
    value: function noteFromStep(step) {
      var note = step % notes.length;
      return notes[note];
    }
  }, {
    key: 'stringToNote',
    value: function stringToNote(str) {
      var octaveIndex = str.match(/[0-9]/).index;
      var octave = str.slice(octaveIndex);
      var note = str.slice(0, octaveIndex);
      return { note: note, octave: octave };
    }
  }, {
    key: 'freqFromNote',
    value: function freqFromNote(inputNote) {
      if (typeof inputNote !== 'string') return null;

      var _Convert$stringToNote = Convert.stringToNote(inputNote),
          note = _Convert$stringToNote.note,
          octave = _Convert$stringToNote.octave;

      var semi = notes.indexOf(note);
      var freq = Convert.freqFromStep(semi);
      var diff = octave - 4;
      var dir = Math.sign(diff);
      while (diff) {
        if (dir === 1) {
          freq *= 2;
          diff--;
        } else {
          freq /= 2;
          diff++;
        }
      };
      return freq;
    }
  }, {
    key: 'round',
    value: function round(number, precision) {
      var factor = Math.pow(10, precision);
      var tempNumber = number * factor;
      var roundedTempNumber = Math.round(tempNumber);
      return roundedTempNumber / factor;
    }
  }]);

  return Convert;
}();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sequencer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _step = require('./step.es6');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sequencer = exports.Sequencer = function () {
  function Sequencer(audioContext) {
    var bpm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 120;

    _classCallCheck(this, Sequencer);

    this.context = audioContext;
    this.bpm = bpm;
    this.stepCount = 0;
    this.sequenceLength = 24; // fixed TODO
    this.beatsPerSequence = 4; // fixed TODO
    // bpm / 60 = beats per sec
    var bps = this.bpm / 60;
    // bps * steps/beat = steps per sec
    var stps = bps * (this.sequenceLength / this.beatsPerSequence);
    // sps ** -1 = sec per step
    this.secPerStep = Math.pow(stps, -1);
    this.lastScheduledTime = 0;
    this.sequence = Array(this.sequenceLength);
    this.looping = false;
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
    key: 'loop',
    value: function loop() {
      this.looping = true;
      this.scheduleSequence(); // schedule next loop & write lastScheduledTime
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
    key: 'boundStep',
    value: function boundStep(sequenceNumber) {
      if (sequenceNumber < 0 || sequenceNumber > this.sequenceLength) {
        sequenceNumber = Math.round(sequenceNumber % this.sequenceLength);
      }
      return sequenceNumber;
    }
  }, {
    key: 'addStep',
    value: function addStep(sequenceNumber, target, value) {
      sequenceNumber = this.boundStep(sequenceNumber);
      var step = new _step.Step(target, value);
      this.sequence[sequenceNumber] = step;
      return step; // FIXME maybe self instead to chain 
    }
  }, {
    key: 'getStep',
    value: function getStep(sequenceNumber) {
      sequenceNumber = this.boundStep(sequenceNumber);
      return this.sequence[sequenceNumber];
    }
  }, {
    key: 'newAction',
    value: function newAction(sequenceNumber, target, value) {
      if (sequenceNumber < 0 || sequenceNumber > this.sequence.length) return null;

      var step = this.sequence[sequenceNumber];
      // Check if we need to initialize a step before adding actions
      if (!(step instanceof _step.Step)) {
        step = this.addStep(sequenceNumber);
      }

      step.newAction(target, value);
      return self;
    }
  }, {
    key: 'scheduleSequence',
    value: function scheduleSequence() {
      var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var schedule = Array(this.sequenceLength);
      for (var s = 0; s < this.sequenceLength - 1; s++) {
        // Schedule each step of a sequence ~sequentially~
        var time = this.calculateStepRunTime(s);
        if (!time) continue;
        schedule.push(time);
        if (skip) continue;

        // have step schedule it's actions
        var step = this.sequence[s];
        try {
          step.scheduleActions(time);
        } catch (e) {}
        //skip

        // TODO HIGH might need setTimeOut to call other actions at time, but might be off
      }
      this.lastScheduledTime = schedule.slice(-1)[0] || 0;

      return this.lastScheduledTime; // Could be used for scheduling restart, but should be removed if not
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
      if (stepNumber < 0) return null;
      // if ((stepNumber <= 0) || (stepNumber < this.stepCount)) return null;
      return this.currentTime() + stepNumber * this.secPerStep;
    }
  }]);

  return Sequencer;
}();

},{"./step.es6":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StepAction = function StepAction(target, value) {
  _classCallCheck(this, StepAction);

  this.target = target;
  this.value = value;
};

var Step = exports.Step = function () {
  function Step(id) {
    var actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Step);

    this.id = id;
    this.actions = actions; // StepAction
  }

  _createClass(Step, [{
    key: "scheduleActions",
    value: function scheduleActions(time) {
      // Schedule each of the actions for a step to occur at the same time
      this.actions.forEach(function (action) {
        var target = action.target;
        var value = action.value;
        target.setValueAtTime(value, time); // FIXME PERF hopefully big obj not passed by value
        // const target = synth.keys[target]; lookup via synth
      });
    }
  }, {
    key: "newAction",
    value: function newAction(target, value) {
      var action = new StepAction(target, value);
      this.addAction(action);
    }
  }, {
    key: "addAction",
    value: function addAction(action) {
      // TODO Could check for dupes but last val = the final set during scheduling
      this.actions.push(action);
    }
  }, {
    key: "removeActions",
    value: function removeActions() {
      // Would like to do single removal but would need way to track actions
      // NBD for key on / off though, since key could be id to replace
      this.actions = [];
    }
  }]);

  return Step;
}();

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Synth = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _convert = require('./convert.es6');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Synth = exports.Synth = function () {
  function Synth(context, output) {
    _classCallCheck(this, Synth);

    this.audioContext = context;
    this.output = output;
    this.oscillators = {};
    this.gains = {};
  }

  _createClass(Synth, [{
    key: 'createNote',
    value: function createNote(inputNote) {
      var note = inputNote;
      var freq = _convert.Convert.freqFromNote(note);
      var osc = this.createOscillator(freq);
      var gain = this.createGain();
      osc.connect(gain);
      osc.start();
      this.oscillators[inputNote] = osc;
      this.gains[inputNote] = gain;
    }
  }, {
    key: 'createGain',
    value: function createGain() {
      var g = this.audioContext.createGain();
      g.connect(this.output);
      g.gain.value = 0;
      return g;
    }
  }, {
    key: 'createOscillator',
    value: function createOscillator(freq) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sine';

      var o = this.audioContext.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      return o;
    }
  }, {
    key: 'toggle',
    value: function toggle(key, on) {
      if (on) {
        this.on(key);
      } else {
        this.off(key);
      }
    }
  }, {
    key: 'on',
    value: function on(key) {
      var volume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

      this.gains[key].gain.value = volume;
    }
  }, {
    key: 'off',
    value: function off(key) {
      this.gains[key].gain.value = 0;
    }
  }]);

  return Synth;
}();

},{"./convert.es6":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _convert = require('./convert.es6');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI = exports.UI = function () {
  function UI() {
    _classCallCheck(this, UI);
  }

  _createClass(UI, null, [{
    key: 'makeKey',
    value: function makeKey(note, toggleAction) {
      var key = document.createElement('div');
      key.id = note;
      key.innerHTML = note.replace('b', '♭');
      key.classList.add('key');

      if (note.match('b')) key.classList.add('ebony');
      var freq = _convert.Convert.freqFromNote(note);
      key.dataset.frequency = _convert.Convert.round(freq, 3);

      key.addEventListener('click', toggleAction);
      return key;
    }
  }, {
    key: 'makeStep',
    value: function makeStep(num) {
      if (!num) throw Error('no step number');
      var step = document.createElement('div');
      step.id = 'step-' + num;
      step.addEventListener('click', sequence);
      return step;
    }
  }, {
    key: 'makeStop',
    value: function makeStop(action) {
      if (!action) throw Error('no stop action');
      var stop = document.createElement('div');
      stop.id = 'stop';
      stop.classList.add('stop');
      stop.addEventListener('click', action);
      return stop;
    }
  }, {
    key: 'makePlay',
    value: function makePlay(action) {
      if (!action) throw Error('no play action');
      var play = document.createElement('div');
      play.id = 'play';
      play.classList.add('play');
      play.addEventListener('click', action);
      return play;
    }
  }, {
    key: 'toggle',
    value: function toggle(note) {
      var key = document.getElementById(note);
      var on = key.classList.toggle('on');
      return on;
    }
  }]);

  return UI;
}();

},{"./convert.es6":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmVzNiIsInNyYy9jb252ZXJ0LmVzNiIsInNyYy9zZXF1ZW5jZXIuZXM2Iiwic3JjL3N0ZXAuZXM2Iiwic3JjL3N5bnRoLmVzNiIsInNyYy91aS5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUNBOztBQUNBOztBQUVBLElBQUksUUFBUyxPQUFPLFlBQVAsSUFBdUIsT0FBTyxrQkFBM0M7QUFDQSxJQUFNLGVBQWUsSUFBSSxLQUFKLEVBQXJCOztBQUVBLElBQU0sU0FBUyxhQUFhLFdBQTVCO0FBQ0EsSUFBTSxZQUFZLHlCQUFjLFlBQWQsRUFBNEIsRUFBNUIsQ0FBbEI7O0FBRUEsSUFBTSxTQUFTLGFBQWEsa0JBQWIsRUFBZjtBQUNBLE9BQU8sSUFBUCxHQUFjLFVBQWQ7QUFDQSxPQUFPLFNBQVAsQ0FBaUIsS0FBakIsR0FBeUIsR0FBekI7QUFDQSxPQUFPLElBQVAsQ0FBWSxLQUFaLEdBQW9CLEVBQXBCO0FBQ0EsT0FBTyxPQUFQLENBQWUsTUFBZjs7QUFJQSxJQUFJLFFBQVEsQ0FDVixJQURVLEVBRVYsS0FGVSxFQUdWLElBSFUsRUFJVixJQUpVLEVBS1YsS0FMVSxFQU1WLElBTlUsRUFPVixLQVBVLEVBUVYsSUFSVSxFQVNWLElBVFUsRUFVVixLQVZVLEVBV1YsSUFYVSxFQVlWLEtBWlUsRUFhVixJQWJVLENBQVo7O0FBZ0JBLElBQUksUUFBUSxpQkFBVSxZQUFWLEVBQXdCLE1BQXhCLENBQVo7QUFDQSxJQUFNLFVBQVUsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBQWhCOztBQUVBLE1BQU0sT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO0FBQ3RCLFFBQU0sVUFBTixDQUFpQixJQUFqQjtBQUNBLE1BQU0sU0FBUyxTQUFULE1BQVMsR0FBTTtBQUNuQixRQUFNLEtBQUssT0FBRyxNQUFILENBQVUsSUFBVixDQUFYO0FBQ0EsVUFBTSxNQUFO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QU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBYjtBQUNBLFdBQUssRUFBTCxhQUFrQixHQUFsQjtBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsUUFBL0I7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzZCQUVlLE0sRUFBUTtBQUN0QixVQUFJLENBQUMsTUFBTCxFQUFhLE1BQU0sTUFBTyxnQkFBUCxDQUFOO0FBQ2IsVUFBTSxPQUFPLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFiO0FBQ0EsV0FBSyxFQUFMLEdBQVUsTUFBVjtBQUNBLFdBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsTUFBbkI7QUFDQSxXQUFLLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLE1BQS9CO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7Ozs2QkFFZSxNLEVBQVE7QUFDdEIsVUFBSSxDQUFDLE1BQUwsRUFBYSxNQUFNLE1BQU8sZ0JBQVAsQ0FBTjtBQUNiLFVBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBYjtBQUNBLFdBQUssRUFBTCxHQUFVLE1BQVY7QUFDQSxXQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLE1BQW5CO0FBQ0EsV0FBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixNQUEvQjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7MkJBRWEsSSxFQUFNO0FBQ2xCLFVBQU0sTUFBTSxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsQ0FBWjtBQUNBLFVBQU0sS0FBSyxJQUFJLFNBQUosQ0FBYyxNQUFkLENBQXFCLElBQXJCLENBQVg7QUFDQSxhQUFPLEVBQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBTeW50aCB9IGZyb20gJy4vc3ludGguZXM2JztcbmltcG9ydCB7IFVJIH0gZnJvbSAnLi91aS5lczYnO1xuaW1wb3J0IHsgU2VxdWVuY2VyIH0gZnJvbSAnLi9zZXF1ZW5jZXIuZXM2JztcblxudmFyIGF1ZGlvID0gIHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbmNvbnN0IGF1ZGlvQ29udGV4dCA9IG5ldyBhdWRpbygpO1xuXG5jb25zdCBvdXRwdXQgPSBhdWRpb0NvbnRleHQuZGVzdGluYXRpb247XG5jb25zdCBzZXF1ZW5jZXIgPSBuZXcgU2VxdWVuY2VyKGF1ZGlvQ29udGV4dCwgOTApO1xuXG5jb25zdCBmaWx0ZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG5maWx0ZXIudHlwZSA9ICdsb3dzaGVsZic7XG5maWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gNDQwO1xuZmlsdGVyLmdhaW4udmFsdWUgPSAyNTtcbmZpbHRlci5jb25uZWN0KG91dHB1dCk7XG5cblxuXG5sZXQgbm90ZXMgPSBbXG4gICdBNCcsXG4gICdCYjQnLFxuICAnQjQnLFxuICAnQzQnLFxuICAnRGI0JyxcbiAgJ0Q0JyxcbiAgJ0ViNCcsXG4gICdFNCcsXG4gICdGNCcsXG4gICdHYjQnLFxuICAnRzQnLFxuICAnQWI1JyxcbiAgJ0E1Jyxcbl07XG5cbmxldCBzeW50aCA9IG5ldyBTeW50aChhdWRpb0NvbnRleHQsIGZpbHRlcik7XG5jb25zdCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKTtcblxubm90ZXMuZm9yRWFjaCgobm90ZSkgPT4ge1xuICBzeW50aC5jcmVhdGVOb3RlKG5vdGUpO1xuICBjb25zdCBhY3Rpb24gPSAoKSA9PiB7XG4gICAgY29uc3Qgb24gPSBVSS50b2dnbGUobm90ZSk7XG4gICAgc3ludGgudG9nZ2xlKG5vdGUsIG9uKTtcbiAgfTtcbiAgY29uc3Qga2V5ID0gVUkubWFrZUtleShub3RlLCBhY3Rpb24pO1xuICBjb250ZW50LmFwcGVuZENoaWxkKGtleSk7XG59KTtcblxuaWYgKGNvbnRlbnQuY2hpbGRFbGVtZW50Q291bnQpIHtcbiAgY29uc29sZS5sb2coJ3N1cmZpbiBvbiBzaW5lIHdhdmVzJyk7XG59IGVsc2Uge1xuICBjb250ZW50LmlubmVySFRNTCA9ICdicm9rZSBpdCDCr1xcXFxfKOODhClfL8KvJztcbn1cblxuc2VxdWVuY2VyLm5ld0FjdGlvbigxLCBzeW50aC5nYWluc1snQTQnXS5nYWluLCAxKTtcbnNlcXVlbmNlci5uZXdBY3Rpb24oMiwgc3ludGguZ2FpbnNbJ0E0J10uZ2FpbiwgMCk7XG5cbnNlcXVlbmNlci5uZXdBY3Rpb24oMiwgc3ludGguZ2FpbnNbJ0I0J10uZ2FpbiwgMSk7XG5zZXF1ZW5jZXIubmV3QWN0aW9uKDMsIHN5bnRoLmdhaW5zWydCNCddLmdhaW4sIDApO1xuXG5zZXF1ZW5jZXIubmV3QWN0aW9uKDMsIHN5bnRoLmdhaW5zWydDNCddLmdhaW4sIDEpO1xuc2VxdWVuY2VyLm5ld0FjdGlvbig0LCBzeW50aC5nYWluc1snQzQnXS5nYWluLCAwKTtcblxuc2VxdWVuY2VyLm5ld0FjdGlvbig1LCBzeW50aC5nYWluc1snRzQnXS5nYWluLCAxKTtcbnNlcXVlbmNlci5uZXdBY3Rpb24oOSwgc3ludGguZ2FpbnNbJ0c0J10uZ2FpbiwgMCk7XG5cbnNlcXVlbmNlci5uZXdBY3Rpb24oOSwgc3ludGguZ2FpbnNbJ0E0J10uZ2FpbiwgMSk7XG5zZXF1ZW5jZXIubmV3QWN0aW9uKDExLCBzeW50aC5nYWluc1snQTQnXS5nYWluLCAwKTtcblxuc2VxdWVuY2VyLm5ld0FjdGlvbigxMSwgc3ludGguZ2FpbnNbJ0c0J10uZ2FpbiwgMSk7XG5zZXF1ZW5jZXIubmV3QWN0aW9uKDE5LCBzeW50aC5nYWluc1snRzQnXS5nYWluLCAwKTtcblxuY29uc3QgbG9vcCA9ICgpID0+IHtcbiAgY29uc3QgbGFzdCA9IHNlcXVlbmNlci5zY2hlZHVsZVNlcXVlbmNlKCk7XG4gIGNvbnN0IG5leHQgPSBsYXN0ICogMTAwMDtcbiAgY29uc29sZS5sb2coYG5leHQgJHtuZXh0fWApXG59O1xuY29udGVudC5hcHBlbmRDaGlsZChVSS5tYWtlUGxheShsb29wKSk7XG5cbi8qIE5vdCB3b3JraW5nXG5BLiBkb250IGtub3cgaG93IHRvIHVzZSBpbnRlcnZhbHMgdG8gbWFrZSBsb29wc1xuQi4gc2NoZWR1bGVkIGNoYW5nZXMgYXJlbnQgc3RvcHBlZCBieSBjbGVhckludGVydmFsIGFueXdheVxuY29udGVudC5hcHBlbmRDaGlsZChVSS5tYWtlU3RvcChzdG9wKSk7XG5jb25zdCBzdG9wID0gKGxvb3BlcikgPT4gY2xlYXJJbnRlcnZhbChsb29wZXIpO1xuKi9cblxuIiwiY29uc3Qgbm90ZXMgPSBbICdBJywgJ0JiJywgJ0InLCAnQycsICdEYicsICdEJywgJ0ViJywgJ0UnLCAnRicsICdHYicsICdHJ107XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJ0IHtcblxuICBzdGF0aWMgZnJlcUZyb21TdGVwKHN0ZXBzLCBmaXhlZCA9IDQ0MCkge1xuICAgIGNvbnN0IGEgPSAyICoqICgxLzEyKTtcbiAgICByZXR1cm4gZml4ZWQgKiBNYXRoLnBvdyhhLCBzdGVwcyk7XG4gIH1cblxuICBzdGF0aWMgbm90ZUZyb21TdGVwKHN0ZXApIHtcbiAgICBjb25zdCBub3RlID0gc3RlcCAlIG5vdGVzLmxlbmd0aDtcbiAgICByZXR1cm4gbm90ZXNbbm90ZV07XG4gIH1cblxuICBzdGF0aWMgc3RyaW5nVG9Ob3RlKHN0cikge1xuICAgIGNvbnN0IG9jdGF2ZUluZGV4ID0gc3RyLm1hdGNoKC9bMC05XS8pLmluZGV4O1xuICAgIGNvbnN0IG9jdGF2ZSA9IHN0ci5zbGljZShvY3RhdmVJbmRleCk7XG4gICAgY29uc3Qgbm90ZSA9IHN0ci5zbGljZSgwLCBvY3RhdmVJbmRleCk7XG4gICAgcmV0dXJuIHsgbm90ZSwgb2N0YXZlIH07XG4gIH1cblxuICBzdGF0aWMgZnJlcUZyb21Ob3RlKGlucHV0Tm90ZSkge1xuICAgIGlmICh0eXBlb2YgaW5wdXROb3RlICE9PSAnc3RyaW5nJykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgeyBub3RlLCBvY3RhdmUgfSA9ICBDb252ZXJ0LnN0cmluZ1RvTm90ZShpbnB1dE5vdGUpO1xuICAgIGNvbnN0IHNlbWkgPSBub3Rlcy5pbmRleE9mKG5vdGUpO1xuICAgIGxldCBmcmVxID0gQ29udmVydC5mcmVxRnJvbVN0ZXAoc2VtaSk7XG4gICAgbGV0IGRpZmYgPSBvY3RhdmUgLSA0O1xuICAgIGxldCBkaXIgPSBNYXRoLnNpZ24oZGlmZik7XG4gICAgd2hpbGUgKGRpZmYpIHtcbiAgICAgIGlmIChkaXIgPT09IDEpIHtcbiAgICAgICAgZnJlcSAqPSAyO1xuICAgICAgICBkaWZmLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcmVxIC89IDI7XG4gICAgICAgIGRpZmYrKztcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBmcmVxO1xuICB9XG5cbiAgc3RhdGljIHJvdW5kKG51bWJlciwgcHJlY2lzaW9uKSB7XG4gICAgICB2YXIgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG4gICAgICB2YXIgdGVtcE51bWJlciA9IG51bWJlciAqIGZhY3RvcjtcbiAgICAgIHZhciByb3VuZGVkVGVtcE51bWJlciA9IE1hdGgucm91bmQodGVtcE51bWJlcik7XG4gICAgICByZXR1cm4gcm91bmRlZFRlbXBOdW1iZXIgLyBmYWN0b3I7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBTdGVwIH0gZnJvbSAnLi9zdGVwLmVzNic7XG5cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZXIge1xuICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGJwbSA9IDEyMCkge1xuICAgIHRoaXMuY29udGV4dCA9IGF1ZGlvQ29udGV4dDtcbiAgICB0aGlzLmJwbSA9IGJwbTtcbiAgICB0aGlzLnN0ZXBDb3VudCA9IDA7XG4gICAgdGhpcy5zZXF1ZW5jZUxlbmd0aCA9IDI0OyAvLyBmaXhlZCBUT0RPXG4gICAgdGhpcy5iZWF0c1BlclNlcXVlbmNlID0gNDsgLy8gZml4ZWQgVE9ET1xuICAgIC8vIGJwbSAvIDYwID0gYmVhdHMgcGVyIHNlY1xuICAgIGNvbnN0IGJwcyA9IHRoaXMuYnBtIC8gNjA7XG4gICAgLy8gYnBzICogc3RlcHMvYmVhdCA9IHN0ZXBzIHBlciBzZWNcbiAgICBjb25zdCBzdHBzID0gYnBzICogKHRoaXMuc2VxdWVuY2VMZW5ndGggLyB0aGlzLmJlYXRzUGVyU2VxdWVuY2UpO1xuICAgIC8vIHNwcyAqKiAtMSA9IHNlYyBwZXIgc3RlcFxuICAgIHRoaXMuc2VjUGVyU3RlcCA9IE1hdGgucG93KHN0cHMsIC0xKTtcbiAgICB0aGlzLmxhc3RTY2hlZHVsZWRUaW1lID0gMDtcbiAgICB0aGlzLnNlcXVlbmNlID0gQXJyYXkodGhpcy5zZXF1ZW5jZUxlbmd0aCk7XG4gICAgdGhpcy5sb29waW5nID0gZmFsc2U7XG4gIH1cbiAgcnVuKCkge1xuICAgIGxldCByZXN0YXJ0VGltZSA9IHRoaXMubGFzdFNjaGVkdWxlZFRpbWUgLSB0aGlzLmN1cnJlbnRUaW1lKCk7XG4gICAgaWYgKHJlc3RhcnRUaW1lIDwgMCkge1xuICAgICAgcmVzdGFydFRpbWUgPSAwO1xuICAgIH1cbiAgICAvLyBUT0RPIFBFUkYgbGF0ZW5jeSB2ZXJ5IHBvc3NpYmxlIHdpdGggc2V0VGltZW91dFxuICAgIC8vIFdvdWxkIGxpa2UgY2FsbGJhY2sgb24gc2NoZWR1bGUgZmluaXNoZWQgdG8gcnVuIGFub3RoZXIgaW5zdGFuY2Ugb2Ygc2NoZWR1bGVTZXF1ZW5jZVxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuc2NoZWR1bGVTZXF1ZW5jZSwgcmVzdGFydFRpbWUpO1xuICB9XG4gIGxvb3AoKSB7XG4gICAgdGhpcy5sb29waW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNjaGVkdWxlU2VxdWVuY2UoKTsgLy8gc2NoZWR1bGUgbmV4dCBsb29wICYgd3JpdGUgbGFzdFNjaGVkdWxlZFRpbWVcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zZXF1ZW5jZS5mb3JFYWNoKHN0ZXAgPT4ge1xuICAgICAgc3RlcC5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICAgIGFjdGlvbi50YXJnZXQuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuICBib3VuZFN0ZXAoc2VxdWVuY2VOdW1iZXIpIHtcbiAgICBpZiAoc2VxdWVuY2VOdW1iZXIgPCAwIHx8IHNlcXVlbmNlTnVtYmVyID4gdGhpcy5zZXF1ZW5jZUxlbmd0aCkge1xuICAgICAgc2VxdWVuY2VOdW1iZXIgPSBNYXRoLnJvdW5kKHNlcXVlbmNlTnVtYmVyICUgdGhpcy5zZXF1ZW5jZUxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBzZXF1ZW5jZU51bWJlcjtcbiAgfVxuICBhZGRTdGVwKHNlcXVlbmNlTnVtYmVyLCB0YXJnZXQsIHZhbHVlKSB7XG4gICAgc2VxdWVuY2VOdW1iZXIgPSB0aGlzLmJvdW5kU3RlcChzZXF1ZW5jZU51bWJlcik7XG4gICAgY29uc3Qgc3RlcCA9IG5ldyBTdGVwKHRhcmdldCwgdmFsdWUpO1xuICAgIHRoaXMuc2VxdWVuY2Vbc2VxdWVuY2VOdW1iZXJdID0gc3RlcDtcbiAgICByZXR1cm4gc3RlcDsgLy8gRklYTUUgbWF5YmUgc2VsZiBpbnN0ZWFkIHRvIGNoYWluIFxuICB9XG4gIGdldFN0ZXAoc2VxdWVuY2VOdW1iZXIpIHtcbiAgICBzZXF1ZW5jZU51bWJlciA9IHRoaXMuYm91bmRTdGVwKHNlcXVlbmNlTnVtYmVyKTtcbiAgICByZXR1cm4gdGhpcy5zZXF1ZW5jZVtzZXF1ZW5jZU51bWJlcl07XG4gIH1cblxuICBuZXdBY3Rpb24oc2VxdWVuY2VOdW1iZXIsIHRhcmdldCwgdmFsdWUpIHtcbiAgICBpZiAoKHNlcXVlbmNlTnVtYmVyIDwgMCkgfHwgKHNlcXVlbmNlTnVtYmVyID4gdGhpcy5zZXF1ZW5jZS5sZW5ndGgpKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCBzdGVwID0gdGhpcy5zZXF1ZW5jZVtzZXF1ZW5jZU51bWJlcl07XG4gICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byBpbml0aWFsaXplIGEgc3RlcCBiZWZvcmUgYWRkaW5nIGFjdGlvbnNcbiAgICBpZiAoIShzdGVwIGluc3RhbmNlb2YgU3RlcCkpIHtcbiAgICAgIHN0ZXAgPSB0aGlzLmFkZFN0ZXAoc2VxdWVuY2VOdW1iZXIpO1xuICAgIH1cblxuICAgIHN0ZXAubmV3QWN0aW9uKHRhcmdldCwgdmFsdWUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgc2NoZWR1bGVTZXF1ZW5jZShza2lwID0gZmFsc2UpIHtcbiAgICBjb25zdCBzY2hlZHVsZSA9IEFycmF5KHRoaXMuc2VxdWVuY2VMZW5ndGgpO1xuICAgIGZvciAobGV0IHMgPSAwOyBzIDwgdGhpcy5zZXF1ZW5jZUxlbmd0aCAtIDE7IHMrKykge1xuICAgICAgLy8gU2NoZWR1bGUgZWFjaCBzdGVwIG9mIGEgc2VxdWVuY2UgfnNlcXVlbnRpYWxseX5cbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLmNhbGN1bGF0ZVN0ZXBSdW5UaW1lKHMpO1xuICAgICAgaWYgKCF0aW1lKSBjb250aW51ZTtcbiAgICAgIHNjaGVkdWxlLnB1c2godGltZSk7XG4gICAgICBpZiAoc2tpcCkgY29udGludWU7XG5cbiAgICAgIC8vIGhhdmUgc3RlcCBzY2hlZHVsZSBpdCdzIGFjdGlvbnNcbiAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnNlcXVlbmNlW3NdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RlcC5zY2hlZHVsZUFjdGlvbnModGltZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vc2tpcFxuICAgICAgfVxuICAgICAgLy8gVE9ETyBISUdIIG1pZ2h0IG5lZWQgc2V0VGltZU91dCB0byBjYWxsIG90aGVyIGFjdGlvbnMgYXQgdGltZSwgYnV0IG1pZ2h0IGJlIG9mZlxuICAgIH1cbiAgICB0aGlzLmxhc3RTY2hlZHVsZWRUaW1lID0gc2NoZWR1bGUuc2xpY2UoLTEpWzBdIHx8IDA7XG5cbiAgICByZXR1cm4gdGhpcy5sYXN0U2NoZWR1bGVkVGltZTsgLy8gQ291bGQgYmUgdXNlZCBmb3Igc2NoZWR1bGluZyByZXN0YXJ0LCBidXQgc2hvdWxkIGJlIHJlbW92ZWQgaWYgbm90XG4gICAgLy8gcmV0dXJuIHNlbGY7XG4gIH1cbiAgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldFN0ZXBDb3VudChzZXF1ZW5jZU51bWJlcikge1xuICAgIHJldHVybiB0aGlzLnN0ZXBDb3VudCArIHNlcXVlbmNlTnVtYmVyO1xuICB9XG5cbiAgZ2V0Q3VycmVudFNlcXVlbmNlKCkge1xuICAgIHJldHVybiB0aGlzLnN0ZXBDb3VudCAlIHRoaXMuc2VxdWVuY2VMZW5ndGg7XG4gIH1cblxuICBjYWxjdWxhdGVTdGVwUnVuVGltZShzdGVwTnVtYmVyKSB7XG4gICAgaWYgKHN0ZXBOdW1iZXIgPCAwKXJldHVybiBudWxsO1xuICAgIC8vIGlmICgoc3RlcE51bWJlciA8PSAwKSB8fCAoc3RlcE51bWJlciA8IHRoaXMuc3RlcENvdW50KSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWUoKSArIChzdGVwTnVtYmVyICogdGhpcy5zZWNQZXJTdGVwKTtcbiAgfVxufVxuXG4iLCJjbGFzcyBTdGVwQWN0aW9uIHtcbiAgY29uc3RydWN0b3IodGFyZ2V0LCB2YWx1ZSkge1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RlcCB7XG4gIGNvbnN0cnVjdG9yKGlkLCBhY3Rpb25zID0gW10pIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5hY3Rpb25zID0gYWN0aW9uczsgLy8gU3RlcEFjdGlvblxuICB9XG4gIHNjaGVkdWxlQWN0aW9ucyh0aW1lKSB7XG4gICAgLy8gU2NoZWR1bGUgZWFjaCBvZiB0aGUgYWN0aW9ucyBmb3IgYSBzdGVwIHRvIG9jY3VyIGF0IHRoZSBzYW1lIHRpbWVcbiAgICB0aGlzLmFjdGlvbnMuZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBhY3Rpb24udGFyZ2V0O1xuICAgICAgY29uc3QgdmFsdWUgPSBhY3Rpb24udmFsdWU7XG4gICAgICB0YXJnZXQuc2V0VmFsdWVBdFRpbWUodmFsdWUsIHRpbWUpOyAvLyBGSVhNRSBQRVJGIGhvcGVmdWxseSBiaWcgb2JqIG5vdCBwYXNzZWQgYnkgdmFsdWVcbiAgICAgIC8vIGNvbnN0IHRhcmdldCA9IHN5bnRoLmtleXNbdGFyZ2V0XTsgbG9va3VwIHZpYSBzeW50aFxuICAgIH0pO1xuICB9XG4gIG5ld0FjdGlvbih0YXJnZXQsIHZhbHVlKSB7XG4gICAgY29uc3QgYWN0aW9uID0gbmV3IFN0ZXBBY3Rpb24odGFyZ2V0LCB2YWx1ZSk7XG4gICAgdGhpcy5hZGRBY3Rpb24oYWN0aW9uKTtcbiAgfVxuICBhZGRBY3Rpb24oYWN0aW9uKSB7XG4gICAgLy8gVE9ETyBDb3VsZCBjaGVjayBmb3IgZHVwZXMgYnV0IGxhc3QgdmFsID0gdGhlIGZpbmFsIHNldCBkdXJpbmcgc2NoZWR1bGluZ1xuICAgIHRoaXMuYWN0aW9ucy5wdXNoKGFjdGlvbik7XG4gIH1cbiAgcmVtb3ZlQWN0aW9ucygpIHtcbiAgICAvLyBXb3VsZCBsaWtlIHRvIGRvIHNpbmdsZSByZW1vdmFsIGJ1dCB3b3VsZCBuZWVkIHdheSB0byB0cmFjayBhY3Rpb25zXG4gICAgLy8gTkJEIGZvciBrZXkgb24gLyBvZmYgdGhvdWdoLCBzaW5jZSBrZXkgY291bGQgYmUgaWQgdG8gcmVwbGFjZVxuICAgIHRoaXMuYWN0aW9ucyA9IFtdO1xuICB9XG59XG5cbiIsImltcG9ydCB7IENvbnZlcnQgfSBmcm9tICcuL2NvbnZlcnQuZXM2JztcbmV4cG9ydCBjbGFzcyBTeW50aCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRleHQsIG91dHB1dCkge1xuICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLm91dHB1dCA9IG91dHB1dDtcbiAgICB0aGlzLm9zY2lsbGF0b3JzID0ge307XG4gICAgdGhpcy5nYWlucyA9IHt9O1xuICB9XG4gIGNyZWF0ZU5vdGUoaW5wdXROb3RlKSB7XG4gICAgY29uc3Qgbm90ZSA9IGlucHV0Tm90ZTtcbiAgICBjb25zdCBmcmVxID0gQ29udmVydC5mcmVxRnJvbU5vdGUobm90ZSk7XG4gICAgY29uc3Qgb3NjID0gdGhpcy5jcmVhdGVPc2NpbGxhdG9yKGZyZXEpO1xuICAgIGNvbnN0IGdhaW4gPSB0aGlzLmNyZWF0ZUdhaW4oKTtcbiAgICBvc2MuY29ubmVjdChnYWluKTtcbiAgICBvc2Muc3RhcnQoKTtcbiAgICB0aGlzLm9zY2lsbGF0b3JzW2lucHV0Tm90ZV0gPSBvc2M7XG4gICAgdGhpcy5nYWluc1tpbnB1dE5vdGVdID0gZ2FpbjtcbiAgfVxuXG4gIGNyZWF0ZUdhaW4oKSB7XG4gICAgY29uc3QgZyA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICBnLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICAgIGcuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgcmV0dXJuIGc7XG4gIH1cblxuICBjcmVhdGVPc2NpbGxhdG9yKCBmcmVxLCB0eXBlID0gJ3NpbmUnKSB7XG4gICAgICBjb25zdCBvID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgby50eXBlID0gdHlwZTtcbiAgICAgIG8uZnJlcXVlbmN5LnZhbHVlID0gZnJlcTtcbiAgICAgIHJldHVybiBvO1xuICB9XG4gIHRvZ2dsZShrZXksIG9uKSB7XG4gICAgaWYgKG9uKSB7XG4gICAgICB0aGlzLm9uKGtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2ZmKGtleSk7XG4gICAgfVxuICB9XG4gIG9uKGtleSwgdm9sdW1lID0gMC41KSB7XG4gICAgdGhpcy5nYWluc1trZXldLmdhaW4udmFsdWUgPSB2b2x1bWU7XG4gIH1cbiAgb2ZmKGtleSkge1xuICAgIHRoaXMuZ2FpbnNba2V5XS5nYWluLnZhbHVlID0gMDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29udmVydCB9IGZyb20gJy4vY29udmVydC5lczYnO1xuXG5leHBvcnQgY2xhc3MgVUkge1xuXG4gIHN0YXRpYyBtYWtlS2V5KG5vdGUsIHRvZ2dsZUFjdGlvbikge1xuICAgIGNvbnN0IGtleSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGtleS5pZCA9IG5vdGU7XG4gICAga2V5LmlubmVySFRNTCA9IG5vdGUucmVwbGFjZSgnYicsICfima0nKTtcbiAgICBrZXkuY2xhc3NMaXN0LmFkZCgna2V5Jyk7XG5cbiAgICBpZiAobm90ZS5tYXRjaCgnYicpKSBrZXkuY2xhc3NMaXN0LmFkZCgnZWJvbnknKTtcbiAgICBjb25zdCBmcmVxID0gQ29udmVydC5mcmVxRnJvbU5vdGUobm90ZSk7XG4gICAga2V5LmRhdGFzZXQuZnJlcXVlbmN5ID0gQ29udmVydC5yb3VuZChmcmVxLCAzKTtcblxuICAgIGtleS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUFjdGlvbik7XG4gICAgcmV0dXJuIGtleTtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlU3RlcChudW0pIHtcbiAgICBpZiAoIW51bSkgdGhyb3cgRXJyb3IgKCdubyBzdGVwIG51bWJlcicpO1xuICAgIGNvbnN0IHN0ZXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGVwLmlkID0gYHN0ZXAtJHtudW19YDtcbiAgICBzdGVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VxdWVuY2UpO1xuICAgIHJldHVybiBzdGVwO1xuICB9XG5cbiAgc3RhdGljIG1ha2VTdG9wKGFjdGlvbikge1xuICAgIGlmICghYWN0aW9uKSB0aHJvdyBFcnJvciAoJ25vIHN0b3AgYWN0aW9uJyk7XG4gICAgY29uc3Qgc3RvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0b3AuaWQgPSAnc3RvcCdcbiAgICBzdG9wLmNsYXNzTGlzdC5hZGQoJ3N0b3AnKTtcbiAgICBzdG9wLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWN0aW9uKTtcbiAgICByZXR1cm4gc3RvcDtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlUGxheShhY3Rpb24pIHtcbiAgICBpZiAoIWFjdGlvbikgdGhyb3cgRXJyb3IgKCdubyBwbGF5IGFjdGlvbicpO1xuICAgIGNvbnN0IHBsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5LmlkID0gJ3BsYXknXG4gICAgcGxheS5jbGFzc0xpc3QuYWRkKCdwbGF5Jyk7XG4gICAgcGxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjdGlvbik7XG4gICAgcmV0dXJuIHBsYXk7XG4gIH1cblxuICBzdGF0aWMgdG9nZ2xlKG5vdGUpIHtcbiAgICBjb25zdCBrZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChub3RlKTtcbiAgICBjb25zdCBvbiA9IGtleS5jbGFzc0xpc3QudG9nZ2xlKCdvbicpO1xuICAgIHJldHVybiBvbjtcbiAgfVxufVxuXG4iXX0=
