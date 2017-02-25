(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _synth = require('./synth.es6');

var _ui = require('./ui.es6');

var _sequencer = require('./sequencer.es6');

var audio = window.AudioContext || window.webkitAudioContext;
var audioContext = new audio();
var output = audioContext.destination;

var sequencer = new _sequencer.Sequencer(audioContext, 90);
var gain = audioContext.createGain();

var notes = ['A4', 'Bb4', 'B4', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab5', 'A5'];

var synth = new _synth.Synth(audioContext, output);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmVzNiIsInNyYy9jb252ZXJ0LmVzNiIsInNyYy9zZXF1ZW5jZXIuZXM2Iiwic3JjL3N0ZXAuZXM2Iiwic3JjL3N5bnRoLmVzNiIsInNyYy91aS5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUNBOztBQUNBOztBQUVBLElBQUksUUFBUyxPQUFPLFlBQVAsSUFBdUIsT0FBTyxrQkFBM0M7QUFDQSxJQUFNLGVBQWUsSUFBSSxLQUFKLEVBQXJCO0FBQ0EsSUFBTSxTQUFTLGFBQWEsV0FBNUI7O0FBRUEsSUFBTSxZQUFZLHlCQUFjLFlBQWQsRUFBNEIsRUFBNUIsQ0FBbEI7QUFDQSxJQUFNLE9BQU8sYUFBYSxVQUFiLEVBQWI7O0FBR0EsSUFBSSxRQUFRLENBQ1YsSUFEVSxFQUVWLEtBRlUsRUFHVixJQUhVLEVBSVYsSUFKVSxFQUtWLEtBTFUsRUFNVixJQU5VLEVBT1YsS0FQVSxFQVFWLElBUlUsRUFTVixJQVRVLEVBVVYsS0FWVSxFQVdWLElBWFUsRUFZVixLQVpVLEVBYVYsSUFiVSxDQUFaOztBQWdCQSxJQUFJLFFBQVEsaUJBQVUsWUFBVixFQUF3QixNQUF4QixDQUFaO0FBQ0EsSUFBTSxVQUFVLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQUFoQjs7QUFFQSxNQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBVTtBQUN0QixRQUFNLFVBQU4sQ0FBaUIsSUFBakI7QUFDQSxNQUFNLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDbkIsUUFBTSxLQUFLLE9BQUcsTUFBSCxDQUFVLElBQVYsQ0FBWDtBQUNBLFVBQU0sTUFBTixDQUFhLElBQWIsRUFBbUIsRUFBbkI7QUFDRCxHQUhEO0FBSUEsTUFBTSxNQUFNLE9BQUcsT0FBSCxDQUFXLElBQVgsRUFBaUIsTUFBakIsQ0FBWjtBQUNBLFVBQVEsV0FBUixDQUFvQixHQUFwQjtBQUNELENBUkQ7O0FBVUEs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ZSxNLEVBQVE7QUFDdEIsVUFBSSxDQUFDLE1BQUwsRUFBYSxNQUFNLE1BQU8sZ0JBQVAsQ0FBTjtBQUNiLFVBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBYjtBQUNBLFdBQUssRUFBTCxHQUFVLE1BQVY7QUFDQSxXQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLE1BQW5CO0FBQ0EsV0FBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixNQUEvQjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7NkJBRWUsTSxFQUFRO0FBQ3RCLFVBQUksQ0FBQyxNQUFMLEVBQWEsTUFBTSxNQUFPLGdCQUFQLENBQU47QUFDYixVQUFNLE9BQU8sU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWI7QUFDQSxXQUFLLEVBQUwsR0FBVSxNQUFWO0FBQ0EsV0FBSyxTQUFMLENBQWUsR0FBZixDQUFtQixNQUFuQjtBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsTUFBL0I7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzJCQUVhLEksRUFBTTtBQUNsQixVQUFNLE1BQU0sU0FBUyxjQUFULENBQXdCLElBQXhCLENBQVo7QUFDQSxVQUFNLEtBQUssSUFBSSxTQUFKLENBQWMsTUFBZCxDQUFxQixJQUFyQixDQUFYO0FBQ0EsYUFBTyxFQUFQO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgU3ludGggfSBmcm9tICcuL3N5bnRoLmVzNic7XG5pbXBvcnQgeyBVSSB9IGZyb20gJy4vdWkuZXM2JztcbmltcG9ydCB7IFNlcXVlbmNlciB9IGZyb20gJy4vc2VxdWVuY2VyLmVzNic7XG5cbnZhciBhdWRpbyA9ICB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5jb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgYXVkaW8oKTtcbmNvbnN0IG91dHB1dCA9IGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbjtcblxuY29uc3Qgc2VxdWVuY2VyID0gbmV3IFNlcXVlbmNlcihhdWRpb0NvbnRleHQsIDkwKTtcbmNvbnN0IGdhaW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXG5cbmxldCBub3RlcyA9IFtcbiAgJ0E0JyxcbiAgJ0JiNCcsXG4gICdCNCcsXG4gICdDNCcsXG4gICdEYjQnLFxuICAnRDQnLFxuICAnRWI0JyxcbiAgJ0U0JyxcbiAgJ0Y0JyxcbiAgJ0diNCcsXG4gICdHNCcsXG4gICdBYjUnLFxuICAnQTUnLFxuXTtcblxubGV0IHN5bnRoID0gbmV3IFN5bnRoKGF1ZGlvQ29udGV4dCwgb3V0cHV0KTtcbmNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xuXG5ub3Rlcy5mb3JFYWNoKChub3RlKSA9PiB7XG4gIHN5bnRoLmNyZWF0ZU5vdGUobm90ZSk7XG4gIGNvbnN0IGFjdGlvbiA9ICgpID0+IHtcbiAgICBjb25zdCBvbiA9IFVJLnRvZ2dsZShub3RlKTtcbiAgICBzeW50aC50b2dnbGUobm90ZSwgb24pO1xuICB9O1xuICBjb25zdCBrZXkgPSBVSS5tYWtlS2V5KG5vdGUsIGFjdGlvbik7XG4gIGNvbnRlbnQuYXBwZW5kQ2hpbGQoa2V5KTtcbn0pO1xuXG5pZiAoY29udGVudC5jaGlsZEVsZW1lbnRDb3VudCkge1xuICBjb25zb2xlLmxvZygnc3VyZmluIG9uIHNpbmUgd2F2ZXMnKTtcbn0gZWxzZSB7XG4gIGNvbnRlbnQuaW5uZXJIVE1MID0gJ2Jyb2tlIGl0IMKvXFxcXF8o44OEKV8vwq8nO1xufVxuXG5zZXF1ZW5jZXIubmV3QWN0aW9uKDEsIHN5bnRoLmdhaW5zWydBNCddLmdhaW4sIDEpO1xuc2VxdWVuY2VyLm5ld0FjdGlvbigyLCBzeW50aC5nYWluc1snQTQnXS5nYWluLCAwKTtcblxuc2VxdWVuY2VyLm5ld0FjdGlvbigyLCBzeW50aC5nYWluc1snQjQnXS5nYWluLCAxKTtcbnNlcXVlbmNlci5uZXdBY3Rpb24oMywgc3ludGguZ2FpbnNbJ0I0J10uZ2FpbiwgMCk7XG5cbnNlcXVlbmNlci5uZXdBY3Rpb24oMywgc3ludGguZ2FpbnNbJ0M0J10uZ2FpbiwgMSk7XG5zZXF1ZW5jZXIubmV3QWN0aW9uKDQsIHN5bnRoLmdhaW5zWydDNCddLmdhaW4sIDApO1xuXG5zZXF1ZW5jZXIubmV3QWN0aW9uKDUsIHN5bnRoLmdhaW5zWydHNCddLmdhaW4sIDEpO1xuc2VxdWVuY2VyLm5ld0FjdGlvbig5LCBzeW50aC5nYWluc1snRzQnXS5nYWluLCAwKTtcblxuc2VxdWVuY2VyLm5ld0FjdGlvbig5LCBzeW50aC5nYWluc1snQTQnXS5nYWluLCAxKTtcbnNlcXVlbmNlci5uZXdBY3Rpb24oMTEsIHN5bnRoLmdhaW5zWydBNCddLmdhaW4sIDApO1xuXG5zZXF1ZW5jZXIubmV3QWN0aW9uKDExLCBzeW50aC5nYWluc1snRzQnXS5nYWluLCAxKTtcbnNlcXVlbmNlci5uZXdBY3Rpb24oMTksIHN5bnRoLmdhaW5zWydHNCddLmdhaW4sIDApO1xuXG5jb25zdCBsb29wID0gKCkgPT4ge1xuICBjb25zdCBsYXN0ID0gc2VxdWVuY2VyLnNjaGVkdWxlU2VxdWVuY2UoKTtcbiAgY29uc3QgbmV4dCA9IGxhc3QgKiAxMDAwO1xuICBjb25zb2xlLmxvZyhgbmV4dCAke25leHR9YClcbn07XG5jb250ZW50LmFwcGVuZENoaWxkKFVJLm1ha2VQbGF5KGxvb3ApKTtcblxuLyogTm90IHdvcmtpbmdcbkEuIGRvbnQga25vdyBob3cgdG8gdXNlIGludGVydmFscyB0byBtYWtlIGxvb3BzXG5CLiBzY2hlZHVsZWQgY2hhbmdlcyBhcmVudCBzdG9wcGVkIGJ5IGNsZWFySW50ZXJ2YWwgYW55d2F5XG5jb250ZW50LmFwcGVuZENoaWxkKFVJLm1ha2VTdG9wKHN0b3ApKTtcbmNvbnN0IHN0b3AgPSAobG9vcGVyKSA9PiBjbGVhckludGVydmFsKGxvb3Blcik7XG4qL1xuXG4iLCJjb25zdCBub3RlcyA9IFsgJ0EnLCAnQmInLCAnQicsICdDJywgJ0RiJywgJ0QnLCAnRWInLCAnRScsICdGJywgJ0diJywgJ0cnXTtcblxuZXhwb3J0IGNsYXNzIENvbnZlcnQge1xuXG4gIHN0YXRpYyBmcmVxRnJvbVN0ZXAoc3RlcHMsIGZpeGVkID0gNDQwKSB7XG4gICAgY29uc3QgYSA9IDIgKiogKDEvMTIpO1xuICAgIHJldHVybiBmaXhlZCAqIE1hdGgucG93KGEsIHN0ZXBzKTtcbiAgfVxuXG4gIHN0YXRpYyBub3RlRnJvbVN0ZXAoc3RlcCkge1xuICAgIGNvbnN0IG5vdGUgPSBzdGVwICUgbm90ZXMubGVuZ3RoO1xuICAgIHJldHVybiBub3Rlc1tub3RlXTtcbiAgfVxuXG4gIHN0YXRpYyBzdHJpbmdUb05vdGUoc3RyKSB7XG4gICAgY29uc3Qgb2N0YXZlSW5kZXggPSBzdHIubWF0Y2goL1swLTldLykuaW5kZXg7XG4gICAgY29uc3Qgb2N0YXZlID0gc3RyLnNsaWNlKG9jdGF2ZUluZGV4KTtcbiAgICBjb25zdCBub3RlID0gc3RyLnNsaWNlKDAsIG9jdGF2ZUluZGV4KTtcbiAgICByZXR1cm4geyBub3RlLCBvY3RhdmUgfTtcbiAgfVxuXG4gIHN0YXRpYyBmcmVxRnJvbU5vdGUoaW5wdXROb3RlKSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dE5vdGUgIT09ICdzdHJpbmcnKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCB7IG5vdGUsIG9jdGF2ZSB9ID0gIENvbnZlcnQuc3RyaW5nVG9Ob3RlKGlucHV0Tm90ZSk7XG4gICAgY29uc3Qgc2VtaSA9IG5vdGVzLmluZGV4T2Yobm90ZSk7XG4gICAgbGV0IGZyZXEgPSBDb252ZXJ0LmZyZXFGcm9tU3RlcChzZW1pKTtcbiAgICBsZXQgZGlmZiA9IG9jdGF2ZSAtIDQ7XG4gICAgbGV0IGRpciA9IE1hdGguc2lnbihkaWZmKTtcbiAgICB3aGlsZSAoZGlmZikge1xuICAgICAgaWYgKGRpciA9PT0gMSkge1xuICAgICAgICBmcmVxICo9IDI7XG4gICAgICAgIGRpZmYtLTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZyZXEgLz0gMjtcbiAgICAgICAgZGlmZisrO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGZyZXE7XG4gIH1cblxuICBzdGF0aWMgcm91bmQobnVtYmVyLCBwcmVjaXNpb24pIHtcbiAgICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcbiAgICAgIHZhciB0ZW1wTnVtYmVyID0gbnVtYmVyICogZmFjdG9yO1xuICAgICAgdmFyIHJvdW5kZWRUZW1wTnVtYmVyID0gTWF0aC5yb3VuZCh0ZW1wTnVtYmVyKTtcbiAgICAgIHJldHVybiByb3VuZGVkVGVtcE51bWJlciAvIGZhY3RvcjtcbiAgfTtcbn1cbiIsImltcG9ydCB7IFN0ZXAgfSBmcm9tICcuL3N0ZXAuZXM2JztcblxuZXhwb3J0IGNsYXNzIFNlcXVlbmNlciB7XG4gIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgYnBtID0gMTIwKSB7XG4gICAgdGhpcy5jb250ZXh0ID0gYXVkaW9Db250ZXh0O1xuICAgIHRoaXMuYnBtID0gYnBtO1xuICAgIHRoaXMuc3RlcENvdW50ID0gMDtcbiAgICB0aGlzLnNlcXVlbmNlTGVuZ3RoID0gMjQ7IC8vIGZpeGVkIFRPRE9cbiAgICB0aGlzLmJlYXRzUGVyU2VxdWVuY2UgPSA0OyAvLyBmaXhlZCBUT0RPXG4gICAgLy8gYnBtIC8gNjAgPSBiZWF0cyBwZXIgc2VjXG4gICAgY29uc3QgYnBzID0gdGhpcy5icG0gLyA2MDtcbiAgICAvLyBicHMgKiBzdGVwcy9iZWF0ID0gc3RlcHMgcGVyIHNlY1xuICAgIGNvbnN0IHN0cHMgPSBicHMgKiAodGhpcy5zZXF1ZW5jZUxlbmd0aCAvIHRoaXMuYmVhdHNQZXJTZXF1ZW5jZSk7XG4gICAgLy8gc3BzICoqIC0xID0gc2VjIHBlciBzdGVwXG4gICAgdGhpcy5zZWNQZXJTdGVwID0gTWF0aC5wb3coc3RwcywgLTEpO1xuICAgIHRoaXMubGFzdFNjaGVkdWxlZFRpbWUgPSAwO1xuICAgIHRoaXMuc2VxdWVuY2UgPSBBcnJheSh0aGlzLnNlcXVlbmNlTGVuZ3RoKTtcbiAgICB0aGlzLmxvb3BpbmcgPSBmYWxzZTtcbiAgfVxuICBydW4oKSB7XG4gICAgbGV0IHJlc3RhcnRUaW1lID0gdGhpcy5sYXN0U2NoZWR1bGVkVGltZSAtIHRoaXMuY3VycmVudFRpbWUoKTtcbiAgICBpZiAocmVzdGFydFRpbWUgPCAwKSB7XG4gICAgICByZXN0YXJ0VGltZSA9IDA7XG4gICAgfVxuICAgIC8vIFRPRE8gUEVSRiBsYXRlbmN5IHZlcnkgcG9zc2libGUgd2l0aCBzZXRUaW1lb3V0XG4gICAgLy8gV291bGQgbGlrZSBjYWxsYmFjayBvbiBzY2hlZHVsZSBmaW5pc2hlZCB0byBydW4gYW5vdGhlciBpbnN0YW5jZSBvZiBzY2hlZHVsZVNlcXVlbmNlXG4gICAgd2luZG93LnNldFRpbWVvdXQodGhpcy5zY2hlZHVsZVNlcXVlbmNlLCByZXN0YXJ0VGltZSk7XG4gIH1cbiAgbG9vcCgpIHtcbiAgICB0aGlzLmxvb3BpbmcgPSB0cnVlO1xuICAgIHRoaXMuc2NoZWR1bGVTZXF1ZW5jZSgpOyAvLyBzY2hlZHVsZSBuZXh0IGxvb3AgJiB3cml0ZSBsYXN0U2NoZWR1bGVkVGltZVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnNlcXVlbmNlLmZvckVhY2goc3RlcCA9PiB7XG4gICAgICBzdGVwLmZvckVhY2goYWN0aW9uID0+IHtcbiAgICAgICAgYWN0aW9uLnRhcmdldC5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG4gIGJvdW5kU3RlcChzZXF1ZW5jZU51bWJlcikge1xuICAgIGlmIChzZXF1ZW5jZU51bWJlciA8IDAgfHwgc2VxdWVuY2VOdW1iZXIgPiB0aGlzLnNlcXVlbmNlTGVuZ3RoKSB7XG4gICAgICBzZXF1ZW5jZU51bWJlciA9IE1hdGgucm91bmQoc2VxdWVuY2VOdW1iZXIgJSB0aGlzLnNlcXVlbmNlTGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcXVlbmNlTnVtYmVyO1xuICB9XG4gIGFkZFN0ZXAoc2VxdWVuY2VOdW1iZXIsIHRhcmdldCwgdmFsdWUpIHtcbiAgICBzZXF1ZW5jZU51bWJlciA9IHRoaXMuYm91bmRTdGVwKHNlcXVlbmNlTnVtYmVyKTtcbiAgICBjb25zdCBzdGVwID0gbmV3IFN0ZXAodGFyZ2V0LCB2YWx1ZSk7XG4gICAgdGhpcy5zZXF1ZW5jZVtzZXF1ZW5jZU51bWJlcl0gPSBzdGVwO1xuICAgIHJldHVybiBzdGVwOyAvLyBGSVhNRSBtYXliZSBzZWxmIGluc3RlYWQgdG8gY2hhaW4gXG4gIH1cbiAgZ2V0U3RlcChzZXF1ZW5jZU51bWJlcikge1xuICAgIHNlcXVlbmNlTnVtYmVyID0gdGhpcy5ib3VuZFN0ZXAoc2VxdWVuY2VOdW1iZXIpO1xuICAgIHJldHVybiB0aGlzLnNlcXVlbmNlW3NlcXVlbmNlTnVtYmVyXTtcbiAgfVxuXG4gIG5ld0FjdGlvbihzZXF1ZW5jZU51bWJlciwgdGFyZ2V0LCB2YWx1ZSkge1xuICAgIGlmICgoc2VxdWVuY2VOdW1iZXIgPCAwKSB8fCAoc2VxdWVuY2VOdW1iZXIgPiB0aGlzLnNlcXVlbmNlLmxlbmd0aCkpIHJldHVybiBudWxsO1xuXG4gICAgbGV0IHN0ZXAgPSB0aGlzLnNlcXVlbmNlW3NlcXVlbmNlTnVtYmVyXTtcbiAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIHRvIGluaXRpYWxpemUgYSBzdGVwIGJlZm9yZSBhZGRpbmcgYWN0aW9uc1xuICAgIGlmICghKHN0ZXAgaW5zdGFuY2VvZiBTdGVwKSkge1xuICAgICAgc3RlcCA9IHRoaXMuYWRkU3RlcChzZXF1ZW5jZU51bWJlcik7XG4gICAgfVxuXG4gICAgc3RlcC5uZXdBY3Rpb24odGFyZ2V0LCB2YWx1ZSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBzY2hlZHVsZVNlcXVlbmNlKHNraXAgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlID0gQXJyYXkodGhpcy5zZXF1ZW5jZUxlbmd0aCk7XG4gICAgZm9yIChsZXQgcyA9IDA7IHMgPCB0aGlzLnNlcXVlbmNlTGVuZ3RoIC0gMTsgcysrKSB7XG4gICAgICAvLyBTY2hlZHVsZSBlYWNoIHN0ZXAgb2YgYSBzZXF1ZW5jZSB+c2VxdWVudGlhbGx5flxuICAgICAgY29uc3QgdGltZSA9IHRoaXMuY2FsY3VsYXRlU3RlcFJ1blRpbWUocyk7XG4gICAgICBpZiAoIXRpbWUpIGNvbnRpbnVlO1xuICAgICAgc2NoZWR1bGUucHVzaCh0aW1lKTtcbiAgICAgIGlmIChza2lwKSBjb250aW51ZTtcblxuICAgICAgLy8gaGF2ZSBzdGVwIHNjaGVkdWxlIGl0J3MgYWN0aW9uc1xuICAgICAgY29uc3Qgc3RlcCA9IHRoaXMuc2VxdWVuY2Vbc107XG4gICAgICB0cnkge1xuICAgICAgICBzdGVwLnNjaGVkdWxlQWN0aW9ucyh0aW1lKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy9za2lwXG4gICAgICB9XG4gICAgICAvLyBUT0RPIEhJR0ggbWlnaHQgbmVlZCBzZXRUaW1lT3V0IHRvIGNhbGwgb3RoZXIgYWN0aW9ucyBhdCB0aW1lLCBidXQgbWlnaHQgYmUgb2ZmXG4gICAgfVxuICAgIHRoaXMubGFzdFNjaGVkdWxlZFRpbWUgPSBzY2hlZHVsZS5zbGljZSgtMSlbMF0gfHwgMDtcblxuICAgIHJldHVybiB0aGlzLmxhc3RTY2hlZHVsZWRUaW1lOyAvLyBDb3VsZCBiZSB1c2VkIGZvciBzY2hlZHVsaW5nIHJlc3RhcnQsIGJ1dCBzaG91bGQgYmUgcmVtb3ZlZCBpZiBub3RcbiAgICAvLyByZXR1cm4gc2VsZjtcbiAgfVxuICBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgZ2V0U3RlcENvdW50KHNlcXVlbmNlTnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RlcENvdW50ICsgc2VxdWVuY2VOdW1iZXI7XG4gIH1cblxuICBnZXRDdXJyZW50U2VxdWVuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RlcENvdW50ICUgdGhpcy5zZXF1ZW5jZUxlbmd0aDtcbiAgfVxuXG4gIGNhbGN1bGF0ZVN0ZXBSdW5UaW1lKHN0ZXBOdW1iZXIpIHtcbiAgICBpZiAoc3RlcE51bWJlciA8IDApcmV0dXJuIG51bGw7XG4gICAgLy8gaWYgKChzdGVwTnVtYmVyIDw9IDApIHx8IChzdGVwTnVtYmVyIDwgdGhpcy5zdGVwQ291bnQpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZSgpICsgKHN0ZXBOdW1iZXIgKiB0aGlzLnNlY1BlclN0ZXApO1xuICB9XG59XG5cbiIsImNsYXNzIFN0ZXBBY3Rpb24ge1xuICBjb25zdHJ1Y3Rvcih0YXJnZXQsIHZhbHVlKSB7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdGVwIHtcbiAgY29uc3RydWN0b3IoaWQsIGFjdGlvbnMgPSBbXSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zOyAvLyBTdGVwQWN0aW9uXG4gIH1cbiAgc2NoZWR1bGVBY3Rpb25zKHRpbWUpIHtcbiAgICAvLyBTY2hlZHVsZSBlYWNoIG9mIHRoZSBhY3Rpb25zIGZvciBhIHN0ZXAgdG8gb2NjdXIgYXQgdGhlIHNhbWUgdGltZVxuICAgIHRoaXMuYWN0aW9ucy5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGFjdGlvbi50YXJnZXQ7XG4gICAgICBjb25zdCB2YWx1ZSA9IGFjdGlvbi52YWx1ZTtcbiAgICAgIHRhcmdldC5zZXRWYWx1ZUF0VGltZSh2YWx1ZSwgdGltZSk7IC8vIEZJWE1FIFBFUkYgaG9wZWZ1bGx5IGJpZyBvYmogbm90IHBhc3NlZCBieSB2YWx1ZVxuICAgICAgLy8gY29uc3QgdGFyZ2V0ID0gc3ludGgua2V5c1t0YXJnZXRdOyBsb29rdXAgdmlhIHN5bnRoXG4gICAgfSk7XG4gIH1cbiAgbmV3QWN0aW9uKHRhcmdldCwgdmFsdWUpIHtcbiAgICBjb25zdCBhY3Rpb24gPSBuZXcgU3RlcEFjdGlvbih0YXJnZXQsIHZhbHVlKTtcbiAgICB0aGlzLmFkZEFjdGlvbihhY3Rpb24pO1xuICB9XG4gIGFkZEFjdGlvbihhY3Rpb24pIHtcbiAgICAvLyBUT0RPIENvdWxkIGNoZWNrIGZvciBkdXBlcyBidXQgbGFzdCB2YWwgPSB0aGUgZmluYWwgc2V0IGR1cmluZyBzY2hlZHVsaW5nXG4gICAgdGhpcy5hY3Rpb25zLnB1c2goYWN0aW9uKTtcbiAgfVxuICByZW1vdmVBY3Rpb25zKCkge1xuICAgIC8vIFdvdWxkIGxpa2UgdG8gZG8gc2luZ2xlIHJlbW92YWwgYnV0IHdvdWxkIG5lZWQgd2F5IHRvIHRyYWNrIGFjdGlvbnNcbiAgICAvLyBOQkQgZm9yIGtleSBvbiAvIG9mZiB0aG91Z2gsIHNpbmNlIGtleSBjb3VsZCBiZSBpZCB0byByZXBsYWNlXG4gICAgdGhpcy5hY3Rpb25zID0gW107XG4gIH1cbn1cblxuIiwiaW1wb3J0IHsgQ29udmVydCB9IGZyb20gJy4vY29udmVydC5lczYnO1xuZXhwb3J0IGNsYXNzIFN5bnRoIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgb3V0cHV0KSB7XG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMub3V0cHV0ID0gb3V0cHV0O1xuICAgIHRoaXMub3NjaWxsYXRvcnMgPSB7fTtcbiAgICB0aGlzLmdhaW5zID0ge307XG4gIH1cbiAgY3JlYXRlTm90ZShpbnB1dE5vdGUpIHtcbiAgICBjb25zdCBub3RlID0gaW5wdXROb3RlO1xuICAgIGNvbnN0IGZyZXEgPSBDb252ZXJ0LmZyZXFGcm9tTm90ZShub3RlKTtcbiAgICBjb25zdCBvc2MgPSB0aGlzLmNyZWF0ZU9zY2lsbGF0b3IoZnJlcSk7XG4gICAgY29uc3QgZ2FpbiA9IHRoaXMuY3JlYXRlR2FpbigpO1xuICAgIG9zYy5jb25uZWN0KGdhaW4pO1xuICAgIG9zYy5zdGFydCgpO1xuICAgIHRoaXMub3NjaWxsYXRvcnNbaW5wdXROb3RlXSA9IG9zYztcbiAgICB0aGlzLmdhaW5zW2lucHV0Tm90ZV0gPSBnYWluO1xuICB9XG5cbiAgY3JlYXRlR2FpbigpIHtcbiAgICBjb25zdCBnID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGcuY29ubmVjdCh0aGlzLm91dHB1dCk7XG4gICAgZy5nYWluLnZhbHVlID0gMDtcbiAgICByZXR1cm4gZztcbiAgfVxuXG4gIGNyZWF0ZU9zY2lsbGF0b3IoIGZyZXEsIHR5cGUgPSAnc2luZScpIHtcbiAgICAgIGNvbnN0IG8gPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgICBvLnR5cGUgPSB0eXBlO1xuICAgICAgby5mcmVxdWVuY3kudmFsdWUgPSBmcmVxO1xuICAgICAgcmV0dXJuIG87XG4gIH1cbiAgdG9nZ2xlKGtleSwgb24pIHtcbiAgICBpZiAob24pIHtcbiAgICAgIHRoaXMub24oa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vZmYoa2V5KTtcbiAgICB9XG4gIH1cbiAgb24oa2V5LCB2b2x1bWUgPSAwLjUpIHtcbiAgICB0aGlzLmdhaW5zW2tleV0uZ2Fpbi52YWx1ZSA9IHZvbHVtZTtcbiAgfVxuICBvZmYoa2V5KSB7XG4gICAgdGhpcy5nYWluc1trZXldLmdhaW4udmFsdWUgPSAwO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb252ZXJ0IH0gZnJvbSAnLi9jb252ZXJ0LmVzNic7XG5cbmV4cG9ydCBjbGFzcyBVSSB7XG5cbiAgc3RhdGljIG1ha2VLZXkobm90ZSwgdG9nZ2xlQWN0aW9uKSB7XG4gICAgY29uc3Qga2V5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAga2V5LmlkID0gbm90ZTtcbiAgICBrZXkuaW5uZXJIVE1MID0gbm90ZS5yZXBsYWNlKCdiJywgJ+KZrScpO1xuICAgIGtleS5jbGFzc0xpc3QuYWRkKCdrZXknKTtcblxuICAgIGlmIChub3RlLm1hdGNoKCdiJykpIGtleS5jbGFzc0xpc3QuYWRkKCdlYm9ueScpO1xuICAgIGNvbnN0IGZyZXEgPSBDb252ZXJ0LmZyZXFGcm9tTm90ZShub3RlKTtcbiAgICBrZXkuZGF0YXNldC5mcmVxdWVuY3kgPSBDb252ZXJ0LnJvdW5kKGZyZXEsIDMpO1xuXG4gICAga2V5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlQWN0aW9uKTtcbiAgICByZXR1cm4ga2V5O1xuICB9XG5cbiAgc3RhdGljIG1ha2VTdGVwKG51bSkge1xuICAgIGlmICghbnVtKSB0aHJvdyBFcnJvciAoJ25vIHN0ZXAgbnVtYmVyJyk7XG4gICAgY29uc3Qgc3RlcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0ZXAuaWQgPSBgc3RlcC0ke251bX1gO1xuICAgIHN0ZXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZXF1ZW5jZSk7XG4gICAgcmV0dXJuIHN0ZXA7XG4gIH1cblxuICBzdGF0aWMgbWFrZVN0b3AoYWN0aW9uKSB7XG4gICAgaWYgKCFhY3Rpb24pIHRocm93IEVycm9yICgnbm8gc3RvcCBhY3Rpb24nKTtcbiAgICBjb25zdCBzdG9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3RvcC5pZCA9ICdzdG9wJ1xuICAgIHN0b3AuY2xhc3NMaXN0LmFkZCgnc3RvcCcpO1xuICAgIHN0b3AuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhY3Rpb24pO1xuICAgIHJldHVybiBzdG9wO1xuICB9XG5cbiAgc3RhdGljIG1ha2VQbGF5KGFjdGlvbikge1xuICAgIGlmICghYWN0aW9uKSB0aHJvdyBFcnJvciAoJ25vIHBsYXkgYWN0aW9uJyk7XG4gICAgY29uc3QgcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXkuaWQgPSAncGxheSdcbiAgICBwbGF5LmNsYXNzTGlzdC5hZGQoJ3BsYXknKTtcbiAgICBwbGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWN0aW9uKTtcbiAgICByZXR1cm4gcGxheTtcbiAgfVxuXG4gIHN0YXRpYyB0b2dnbGUobm90ZSkge1xuICAgIGNvbnN0IGtleSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5vdGUpO1xuICAgIGNvbnN0IG9uID0ga2V5LmNsYXNzTGlzdC50b2dnbGUoJ29uJyk7XG4gICAgcmV0dXJuIG9uO1xuICB9XG59XG5cbiJdfQ==
