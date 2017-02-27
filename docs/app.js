(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _synth = require('./synth.es6');

var _ui = require('./ui.es6');

var _sequencer = require('./sequencer.es6');

var audio = window.AudioContext || window.webkitAudioContext;
var audioContext = new audio();
var output = audioContext.destination;

var synth = new _synth.Synth(audioContext, output);

var content = document.getElementById('content');

/*
const filter = audioContext.createBiquadFilter();
filter.type = 'lowshelf';
filter.frequency.value = 880;
filter.gain.value = 25;
filter.connect(output);
let synth = new Synth(audioContext, filter);
*/

function createSynthKey(note) {
  synth.createNote(note);
  var action = function action() {
    var on = _ui.UI.toggle(note);
    synth.toggle(note, on);
  };
  var key = _ui.UI.makeKey(note, action);
  content.appendChild(key);
}

function normal() {
  return function () {
    content.innerHTML = '';
    var notes = ['A4', 'Bb4', 'B4', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab5', 'A5'];
    notes.forEach(function (note) {
      return createSynthKey(note);
    });
    addSequencer();
    areKeysPresent();
  };
}

// μικρός tonal
function mikros() {
  var octaveDivisions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 31;

  return function () {
    content.innerHTML = '';
    for (var i = 0; i < octaveDivisions; i++) {
      var freq = 440 + i * (440 / octaveDivisions);
      createSynthKey(freq);
    }
    areKeysPresent();
  };
}

function areKeysPresent() {
  if (content.childElementCount) {
    console.log('surfin on sine waves');
  } else {
    content.innerHTML = 'broke it ¯\\_(ツ)_/¯';
  }
}

function addSequencer() {
  var sequencer = new _sequencer.Sequencer(audioContext, 90);
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
}

function stopAll(event) {
  return function () {
    for (var g in synth.gains) {
      synth.gains[g].gain.value = 0;
    }
    var onKeys = Array.from(content.getElementsByClassName('on'));
    onKeys.forEach(function (el) {
      return el.classList.remove('on');
    });
  };
}

/* Not working
A. dont know how to use intervals to make loops
B. scheduled changes arent stopped by clearInterval anyway
content.appendChild(UI.makeStop(stop));
const stop = (looper) => clearInterval(looper);
*/

var micro31Button = _ui.UI.makeChoice(mikros(31), "microtuning \'31");
var micro62Button = _ui.UI.makeChoice(mikros(62), "microtuning \'62");
var micro93Button = _ui.UI.makeChoice(mikros(93), "microtuning \'93");
var normalButton = _ui.UI.makeChoice(normal(), 'normal keys');
content.appendChild(micro31Button);
content.appendChild(micro62Button);
content.appendChild(micro93Button);
content.appendChild(normalButton);
var text = document.createElement('p');
text.innerHTML = '<br/>press any key to stop sound';
content.appendChild(text);
areKeysPresent();

window.addEventListener('keypress', stopAll());

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
      var freq = void 0;
      if (typeof inputNote === 'number') {
        freq = inputNote;
      } else {
        freq = _convert.Convert.freqFromNote(inputNote);
      }
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
      key.classList.add('key');
      var label = void 0;
      var freq = void 0;
      if (typeof note === 'string') {
        freq = _convert.Convert.freqFromNote(note);
        label = note.replace('b', '♭');
        if (note.match('b')) key.classList.add('ebony');
      } else if (typeof note === 'number') {
        freq = note;
        label = String(_convert.Convert.round(freq, 1));
      }
      key.innerHTML = label;
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
    key: 'makeChoice',
    value: function makeChoice(action, label) {
      if (!action) throw Error('no choice action');
      if (!label) throw Error('no choice label');
      var choice = document.createElement('div');
      choice.id = 'choice-${label}';
      choice.classList.add('key');
      choice.classList.add('choice');
      choice.innerHTML = label;
      choice.addEventListener('click', action);
      return choice;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmVzNiIsInNyYy9jb252ZXJ0LmVzNiIsInNyYy9zZXF1ZW5jZXIuZXM2Iiwic3JjL3N0ZXAuZXM2Iiwic3JjL3N5bnRoLmVzNiIsInNyYy91aS5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUNBOztBQUNBOztBQUVBLElBQUksUUFBUyxPQUFPLFlBQVAsSUFBdUIsT0FBTyxrQkFBM0M7QUFDQSxJQUFNLGVBQWUsSUFBSSxLQUFKLEVBQXJCO0FBQ0EsSUFBTSxTQUFTLGFBQWEsV0FBNUI7O0FBRUEsSUFBSSxRQUFRLGlCQUFVLFlBQVYsRUFBd0IsTUFBeEIsQ0FBWjs7QUFFQSxJQUFNLFVBQVUsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBQWhCOztBQUVBOzs7Ozs7Ozs7QUFVQSxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEI7QUFDNUIsUUFBTSxVQUFOLENBQWlCLElBQWpCO0FBQ0EsTUFBTSxTQUFTLFNBQVQsTUFBUyxHQUFNO0FBQ25CLFFBQU0sS0FBSyxPQUFHLE1BQUgsQ0FBVSxJQUFWLENBQVg7QUFDQSxVQUFNLE1BQU4sQ0FBYSxJQUFiLEVBQW1CLEVBQW5CO0FBQ0QsR0FIRDtBQUlBLE1BQU0sTUFBTSxPQUFHLE9BQUgsQ0FBVyxJQUFYLEVBQWlCLE1BQWpCLENBQVo7QUFDQSxVQUFRLFdBQVIsQ0FBb0IsR0FBcEI7QUFDRDs7QUFFRCxTQUFTLE1BQVQsR0FBa0I7QUFDaEIsU0FBTyxZQUFNO0FBQ1gsWUFBUSxTQUFSLEdBQW9CLEVBQXBCO0FBQ0EsUUFBSSxRQUFRLENBQUUsSUFBRixFQUFRLEtBQVIsRUFBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLElBQWxDLEVBQXdDLEtBQXhDLEVBQStDLElBQS9DLEVBQXFELElBQXJELEVBQTJELEtBQTNELEVBQWtFLElBQWxFLEVBQXdFLEtBQXhFLEVBQStFLElB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bkI7QUFDQSxhQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLE1BQWpDO0FBQ0EsYUFBTyxNQUFQO0FBQ0Q7Ozs2QkFFZSxNLEVBQVE7QUFDdEIsVUFBSSxDQUFDLE1BQUwsRUFBYSxNQUFNLE1BQU8sZ0JBQVAsQ0FBTjtBQUNiLFVBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBYjtBQUNBLFdBQUssRUFBTCxHQUFVLE1BQVY7QUFDQSxXQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLE1BQW5CO0FBQ0EsV0FBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixNQUEvQjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7NkJBRWUsTSxFQUFRO0FBQ3RCLFVBQUksQ0FBQyxNQUFMLEVBQWEsTUFBTSxNQUFPLGdCQUFQLENBQU47QUFDYixVQUFNLE9BQU8sU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWI7QUFDQSxXQUFLLEVBQUwsR0FBVSxNQUFWO0FBQ0EsV0FBSyxTQUFMLENBQWUsR0FBZixDQUFtQixNQUFuQjtBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsTUFBL0I7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzJCQUVhLEksRUFBTTtBQUNsQixVQUFNLE1BQU0sU0FBUyxjQUFULENBQXdCLElBQXhCLENBQVo7QUFDQSxVQUFNLEtBQUssSUFBSSxTQUFKLENBQWMsTUFBZCxDQUFxQixJQUFyQixDQUFYO0FBQ0EsYUFBTyxFQUFQO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgU3ludGggfSBmcm9tICcuL3N5bnRoLmVzNic7XG5pbXBvcnQgeyBVSSB9IGZyb20gJy4vdWkuZXM2JztcbmltcG9ydCB7IFNlcXVlbmNlciB9IGZyb20gJy4vc2VxdWVuY2VyLmVzNic7XG5cbnZhciBhdWRpbyA9ICB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5jb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgYXVkaW8oKTtcbmNvbnN0IG91dHB1dCA9IGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbjtcblxubGV0IHN5bnRoID0gbmV3IFN5bnRoKGF1ZGlvQ29udGV4dCwgb3V0cHV0KTtcblxuY29uc3QgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jyk7XG5cbi8qXG5jb25zdCBmaWx0ZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG5maWx0ZXIudHlwZSA9ICdsb3dzaGVsZic7XG5maWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gODgwO1xuZmlsdGVyLmdhaW4udmFsdWUgPSAyNTtcbmZpbHRlci5jb25uZWN0KG91dHB1dCk7XG5sZXQgc3ludGggPSBuZXcgU3ludGgoYXVkaW9Db250ZXh0LCBmaWx0ZXIpO1xuKi9cblxuXG5mdW5jdGlvbiBjcmVhdGVTeW50aEtleShub3RlKSB7XG4gIHN5bnRoLmNyZWF0ZU5vdGUobm90ZSk7XG4gIGNvbnN0IGFjdGlvbiA9ICgpID0+IHtcbiAgICBjb25zdCBvbiA9IFVJLnRvZ2dsZShub3RlKTtcbiAgICBzeW50aC50b2dnbGUobm90ZSwgb24pO1xuICB9O1xuICBjb25zdCBrZXkgPSBVSS5tYWtlS2V5KG5vdGUsIGFjdGlvbik7XG4gIGNvbnRlbnQuYXBwZW5kQ2hpbGQoa2V5KTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsKCkge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgbGV0IG5vdGVzID0gWyAnQTQnLCAnQmI0JywgJ0I0JywgJ0M0JywgJ0RiNCcsICdENCcsICdFYjQnLCAnRTQnLCAnRjQnLCAnR2I0JywgJ0c0JywgJ0FiNScsICdBNSddO1xuICAgIG5vdGVzLmZvckVhY2gobm90ZSA9PiBjcmVhdGVTeW50aEtleShub3RlKSk7XG4gICAgYWRkU2VxdWVuY2VyKCk7XG4gICAgYXJlS2V5c1ByZXNlbnQoKTtcbiAgfVxufSBcblxuLy8gzrzOuc66z4HPjM+CIHRvbmFsXG5mdW5jdGlvbiBtaWtyb3Mob2N0YXZlRGl2aXNpb25zID0gMzEpIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBjb250ZW50LmlubmVySFRNTCA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2N0YXZlRGl2aXNpb25zOyBpKyspIHtcbiAgICAgIGxldCBmcmVxID0gNDQwICsgaSAqICg0NDAgLyBvY3RhdmVEaXZpc2lvbnMpO1xuICAgICAgY3JlYXRlU3ludGhLZXkoZnJlcSk7XG4gICAgfVxuICAgIGFyZUtleXNQcmVzZW50KCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXJlS2V5c1ByZXNlbnQoKSB7XG4gIGlmIChjb250ZW50LmNoaWxkRWxlbWVudENvdW50KSB7XG4gICAgY29uc29sZS5sb2coJ3N1cmZpbiBvbiBzaW5lIHdhdmVzJyk7XG4gIH0gZWxzZSB7XG4gICAgY29udGVudC5pbm5lckhUTUwgPSAnYnJva2UgaXQgwq9cXFxcXyjjg4QpXy/Cryc7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkU2VxdWVuY2VyKCkge1xuICBjb25zdCBzZXF1ZW5jZXIgPSBuZXcgU2VxdWVuY2VyKGF1ZGlvQ29udGV4dCwgOTApO1xuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDEsIHN5bnRoLmdhaW5zWydBNCddLmdhaW4sIDEpO1xuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDIsIHN5bnRoLmdhaW5zWydBNCddLmdhaW4sIDApO1xuXG4gIHNlcXVlbmNlci5uZXdBY3Rpb24oMiwgc3ludGguZ2FpbnNbJ0I0J10uZ2FpbiwgMSk7XG4gIHNlcXVlbmNlci5uZXdBY3Rpb24oMywgc3ludGguZ2FpbnNbJ0I0J10uZ2FpbiwgMCk7XG5cbiAgc2VxdWVuY2VyLm5ld0FjdGlvbigzLCBzeW50aC5nYWluc1snQzQnXS5nYWluLCAxKTtcbiAgc2VxdWVuY2VyLm5ld0FjdGlvbig0LCBzeW50aC5nYWluc1snQzQnXS5nYWluLCAwKTtcblxuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDUsIHN5bnRoLmdhaW5zWydHNCddLmdhaW4sIDEpO1xuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDksIHN5bnRoLmdhaW5zWydHNCddLmdhaW4sIDApO1xuXG4gIHNlcXVlbmNlci5uZXdBY3Rpb24oOSwgc3ludGguZ2FpbnNbJ0E0J10uZ2FpbiwgMSk7XG4gIHNlcXVlbmNlci5uZXdBY3Rpb24oMTEsIHN5bnRoLmdhaW5zWydBNCddLmdhaW4sIDApO1xuXG4gIHNlcXVlbmNlci5uZXdBY3Rpb24oMTEsIHN5bnRoLmdhaW5zWydHNCddLmdhaW4sIDEpO1xuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDE5LCBzeW50aC5nYWluc1snRzQnXS5nYWluLCAwKTtcblxuICBjb25zdCBsb29wID0gKCkgPT4ge1xuICAgIGNvbnN0IGxhc3QgPSBzZXF1ZW5jZXIuc2NoZWR1bGVTZXF1ZW5jZSgpO1xuICAgIGNvbnN0IG5leHQgPSBsYXN0ICogMTAwMDtcbiAgICBjb25zb2xlLmxvZyhgbmV4dCAke25leHR9YClcbiAgfTtcbiAgY29udGVudC5hcHBlbmRDaGlsZChVSS5tYWtlUGxheShsb29wKSk7XG59XG5cbmZ1bmN0aW9uIHN0b3BBbGwoZXZlbnQpIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBmb3IgKGxldCBnIGluIHN5bnRoLmdhaW5zKSB7XG4gICAgICBzeW50aC5nYWluc1tnXS5nYWluLnZhbHVlID0gMDtcbiAgICB9XG4gICAgY29uc3Qgb25LZXlzID0gQXJyYXkuZnJvbShjb250ZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ29uJykpO1xuICAgIG9uS2V5cy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ29uJykpO1xuICB9O1xufVxuXG4vKiBOb3Qgd29ya2luZ1xuQS4gZG9udCBrbm93IGhvdyB0byB1c2UgaW50ZXJ2YWxzIHRvIG1ha2UgbG9vcHNcbkIuIHNjaGVkdWxlZCBjaGFuZ2VzIGFyZW50IHN0b3BwZWQgYnkgY2xlYXJJbnRlcnZhbCBhbnl3YXlcbmNvbnRlbnQuYXBwZW5kQ2hpbGQoVUkubWFrZVN0b3Aoc3RvcCkpO1xuY29uc3Qgc3RvcCA9IChsb29wZXIpID0+IGNsZWFySW50ZXJ2YWwobG9vcGVyKTtcbiovXG5cbmNvbnN0IG1pY3JvMzFCdXR0b24gPSBVSS5tYWtlQ2hvaWNlKG1pa3JvcygzMSksIFwibWljcm90dW5pbmcgXFwnMzFcIik7XG5jb25zdCBtaWNybzYyQnV0dG9uID0gVUkubWFrZUNob2ljZShtaWtyb3MoNjIpLCBcIm1pY3JvdHVuaW5nIFxcJzYyXCIpO1xuY29uc3QgbWljcm85M0J1dHRvbiA9IFVJLm1ha2VDaG9pY2UobWlrcm9zKDkzKSwgXCJtaWNyb3R1bmluZyBcXCc5M1wiKTtcbmNvbnN0IG5vcm1hbEJ1dHRvbiA9IFVJLm1ha2VDaG9pY2Uobm9ybWFsKCksICdub3JtYWwga2V5cycpO1xuY29udGVudC5hcHBlbmRDaGlsZChtaWNybzMxQnV0dG9uKTtcbmNvbnRlbnQuYXBwZW5kQ2hpbGQobWljcm82MkJ1dHRvbik7XG5jb250ZW50LmFwcGVuZENoaWxkKG1pY3JvOTNCdXR0b24pO1xuY29udGVudC5hcHBlbmRDaGlsZChub3JtYWxCdXR0b24pO1xuY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbnRleHQuaW5uZXJIVE1MPSAnPGJyLz5wcmVzcyBhbnkga2V5IHRvIHN0b3Agc291bmQnO1xuY29udGVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcbmFyZUtleXNQcmVzZW50KCk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIHN0b3BBbGwoKSk7XG5cblxuIiwiY29uc3Qgbm90ZXMgPSBbICdBJywgJ0JiJywgJ0InLCAnQycsICdEYicsICdEJywgJ0ViJywgJ0UnLCAnRicsICdHYicsICdHJ107XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJ0IHtcblxuICBzdGF0aWMgZnJlcUZyb21TdGVwKHN0ZXBzLCBmaXhlZCA9IDQ0MCkge1xuICAgIGNvbnN0IGEgPSAyICoqICgxLzEyKTtcbiAgICByZXR1cm4gZml4ZWQgKiBNYXRoLnBvdyhhLCBzdGVwcyk7XG4gIH1cblxuICBzdGF0aWMgbm90ZUZyb21TdGVwKHN0ZXApIHtcbiAgICBjb25zdCBub3RlID0gc3RlcCAlIG5vdGVzLmxlbmd0aDtcbiAgICByZXR1cm4gbm90ZXNbbm90ZV07XG4gIH1cblxuICBzdGF0aWMgc3RyaW5nVG9Ob3RlKHN0cikge1xuICAgIGNvbnN0IG9jdGF2ZUluZGV4ID0gc3RyLm1hdGNoKC9bMC05XS8pLmluZGV4O1xuICAgIGNvbnN0IG9jdGF2ZSA9IHN0ci5zbGljZShvY3RhdmVJbmRleCk7XG4gICAgY29uc3Qgbm90ZSA9IHN0ci5zbGljZSgwLCBvY3RhdmVJbmRleCk7XG4gICAgcmV0dXJuIHsgbm90ZSwgb2N0YXZlIH07XG4gIH1cblxuICBzdGF0aWMgZnJlcUZyb21Ob3RlKGlucHV0Tm90ZSkge1xuICAgIGlmICh0eXBlb2YgaW5wdXROb3RlICE9PSAnc3RyaW5nJykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgeyBub3RlLCBvY3RhdmUgfSA9ICBDb252ZXJ0LnN0cmluZ1RvTm90ZShpbnB1dE5vdGUpO1xuICAgIGNvbnN0IHNlbWkgPSBub3Rlcy5pbmRleE9mKG5vdGUpO1xuICAgIGxldCBmcmVxID0gQ29udmVydC5mcmVxRnJvbVN0ZXAoc2VtaSk7XG4gICAgbGV0IGRpZmYgPSBvY3RhdmUgLSA0O1xuICAgIGxldCBkaXIgPSBNYXRoLnNpZ24oZGlmZik7XG4gICAgd2hpbGUgKGRpZmYpIHtcbiAgICAgIGlmIChkaXIgPT09IDEpIHtcbiAgICAgICAgZnJlcSAqPSAyO1xuICAgICAgICBkaWZmLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcmVxIC89IDI7XG4gICAgICAgIGRpZmYrKztcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBmcmVxO1xuICB9XG5cbiAgc3RhdGljIHJvdW5kKG51bWJlciwgcHJlY2lzaW9uKSB7XG4gICAgICB2YXIgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG4gICAgICB2YXIgdGVtcE51bWJlciA9IG51bWJlciAqIGZhY3RvcjtcbiAgICAgIHZhciByb3VuZGVkVGVtcE51bWJlciA9IE1hdGgucm91bmQodGVtcE51bWJlcik7XG4gICAgICByZXR1cm4gcm91bmRlZFRlbXBOdW1iZXIgLyBmYWN0b3I7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBTdGVwIH0gZnJvbSAnLi9zdGVwLmVzNic7XG5cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZXIge1xuICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGJwbSA9IDEyMCkge1xuICAgIHRoaXMuY29udGV4dCA9IGF1ZGlvQ29udGV4dDtcbiAgICB0aGlzLmJwbSA9IGJwbTtcbiAgICB0aGlzLnN0ZXBDb3VudCA9IDA7XG4gICAgdGhpcy5zZXF1ZW5jZUxlbmd0aCA9IDI0OyAvLyBmaXhlZCBUT0RPXG4gICAgdGhpcy5iZWF0c1BlclNlcXVlbmNlID0gNDsgLy8gZml4ZWQgVE9ET1xuICAgIC8vIGJwbSAvIDYwID0gYmVhdHMgcGVyIHNlY1xuICAgIGNvbnN0IGJwcyA9IHRoaXMuYnBtIC8gNjA7XG4gICAgLy8gYnBzICogc3RlcHMvYmVhdCA9IHN0ZXBzIHBlciBzZWNcbiAgICBjb25zdCBzdHBzID0gYnBzICogKHRoaXMuc2VxdWVuY2VMZW5ndGggLyB0aGlzLmJlYXRzUGVyU2VxdWVuY2UpO1xuICAgIC8vIHNwcyAqKiAtMSA9IHNlYyBwZXIgc3RlcFxuICAgIHRoaXMuc2VjUGVyU3RlcCA9IE1hdGgucG93KHN0cHMsIC0xKTtcbiAgICB0aGlzLmxhc3RTY2hlZHVsZWRUaW1lID0gMDtcbiAgICB0aGlzLnNlcXVlbmNlID0gQXJyYXkodGhpcy5zZXF1ZW5jZUxlbmd0aCk7XG4gICAgdGhpcy5sb29waW5nID0gZmFsc2U7XG4gIH1cbiAgcnVuKCkge1xuICAgIGxldCByZXN0YXJ0VGltZSA9IHRoaXMubGFzdFNjaGVkdWxlZFRpbWUgLSB0aGlzLmN1cnJlbnRUaW1lKCk7XG4gICAgaWYgKHJlc3RhcnRUaW1lIDwgMCkge1xuICAgICAgcmVzdGFydFRpbWUgPSAwO1xuICAgIH1cbiAgICAvLyBUT0RPIFBFUkYgbGF0ZW5jeSB2ZXJ5IHBvc3NpYmxlIHdpdGggc2V0VGltZW91dFxuICAgIC8vIFdvdWxkIGxpa2UgY2FsbGJhY2sgb24gc2NoZWR1bGUgZmluaXNoZWQgdG8gcnVuIGFub3RoZXIgaW5zdGFuY2Ugb2Ygc2NoZWR1bGVTZXF1ZW5jZVxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuc2NoZWR1bGVTZXF1ZW5jZSwgcmVzdGFydFRpbWUpO1xuICB9XG4gIGxvb3AoKSB7XG4gICAgdGhpcy5sb29waW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNjaGVkdWxlU2VxdWVuY2UoKTsgLy8gc2NoZWR1bGUgbmV4dCBsb29wICYgd3JpdGUgbGFzdFNjaGVkdWxlZFRpbWVcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zZXF1ZW5jZS5mb3JFYWNoKHN0ZXAgPT4ge1xuICAgICAgc3RlcC5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICAgIGFjdGlvbi50YXJnZXQuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuICBib3VuZFN0ZXAoc2VxdWVuY2VOdW1iZXIpIHtcbiAgICBpZiAoc2VxdWVuY2VOdW1iZXIgPCAwIHx8IHNlcXVlbmNlTnVtYmVyID4gdGhpcy5zZXF1ZW5jZUxlbmd0aCkge1xuICAgICAgc2VxdWVuY2VOdW1iZXIgPSBNYXRoLnJvdW5kKHNlcXVlbmNlTnVtYmVyICUgdGhpcy5zZXF1ZW5jZUxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBzZXF1ZW5jZU51bWJlcjtcbiAgfVxuICBhZGRTdGVwKHNlcXVlbmNlTnVtYmVyLCB0YXJnZXQsIHZhbHVlKSB7XG4gICAgc2VxdWVuY2VOdW1iZXIgPSB0aGlzLmJvdW5kU3RlcChzZXF1ZW5jZU51bWJlcik7XG4gICAgY29uc3Qgc3RlcCA9IG5ldyBTdGVwKHRhcmdldCwgdmFsdWUpO1xuICAgIHRoaXMuc2VxdWVuY2Vbc2VxdWVuY2VOdW1iZXJdID0gc3RlcDtcbiAgICByZXR1cm4gc3RlcDsgLy8gRklYTUUgbWF5YmUgc2VsZiBpbnN0ZWFkIHRvIGNoYWluIFxuICB9XG4gIGdldFN0ZXAoc2VxdWVuY2VOdW1iZXIpIHtcbiAgICBzZXF1ZW5jZU51bWJlciA9IHRoaXMuYm91bmRTdGVwKHNlcXVlbmNlTnVtYmVyKTtcbiAgICByZXR1cm4gdGhpcy5zZXF1ZW5jZVtzZXF1ZW5jZU51bWJlcl07XG4gIH1cblxuICBuZXdBY3Rpb24oc2VxdWVuY2VOdW1iZXIsIHRhcmdldCwgdmFsdWUpIHtcbiAgICBpZiAoKHNlcXVlbmNlTnVtYmVyIDwgMCkgfHwgKHNlcXVlbmNlTnVtYmVyID4gdGhpcy5zZXF1ZW5jZS5sZW5ndGgpKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCBzdGVwID0gdGhpcy5zZXF1ZW5jZVtzZXF1ZW5jZU51bWJlcl07XG4gICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byBpbml0aWFsaXplIGEgc3RlcCBiZWZvcmUgYWRkaW5nIGFjdGlvbnNcbiAgICBpZiAoIShzdGVwIGluc3RhbmNlb2YgU3RlcCkpIHtcbiAgICAgIHN0ZXAgPSB0aGlzLmFkZFN0ZXAoc2VxdWVuY2VOdW1iZXIpO1xuICAgIH1cblxuICAgIHN0ZXAubmV3QWN0aW9uKHRhcmdldCwgdmFsdWUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgc2NoZWR1bGVTZXF1ZW5jZShza2lwID0gZmFsc2UpIHtcbiAgICBjb25zdCBzY2hlZHVsZSA9IEFycmF5KHRoaXMuc2VxdWVuY2VMZW5ndGgpO1xuICAgIGZvciAobGV0IHMgPSAwOyBzIDwgdGhpcy5zZXF1ZW5jZUxlbmd0aCAtIDE7IHMrKykge1xuICAgICAgLy8gU2NoZWR1bGUgZWFjaCBzdGVwIG9mIGEgc2VxdWVuY2UgfnNlcXVlbnRpYWxseX5cbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLmNhbGN1bGF0ZVN0ZXBSdW5UaW1lKHMpO1xuICAgICAgaWYgKCF0aW1lKSBjb250aW51ZTtcbiAgICAgIHNjaGVkdWxlLnB1c2godGltZSk7XG4gICAgICBpZiAoc2tpcCkgY29udGludWU7XG5cbiAgICAgIC8vIGhhdmUgc3RlcCBzY2hlZHVsZSBpdCdzIGFjdGlvbnNcbiAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnNlcXVlbmNlW3NdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RlcC5zY2hlZHVsZUFjdGlvbnModGltZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vc2tpcFxuICAgICAgfVxuICAgICAgLy8gVE9ETyBISUdIIG1pZ2h0IG5lZWQgc2V0VGltZU91dCB0byBjYWxsIG90aGVyIGFjdGlvbnMgYXQgdGltZSwgYnV0IG1pZ2h0IGJlIG9mZlxuICAgIH1cbiAgICB0aGlzLmxhc3RTY2hlZHVsZWRUaW1lID0gc2NoZWR1bGUuc2xpY2UoLTEpWzBdIHx8IDA7XG5cbiAgICByZXR1cm4gdGhpcy5sYXN0U2NoZWR1bGVkVGltZTsgLy8gQ291bGQgYmUgdXNlZCBmb3Igc2NoZWR1bGluZyByZXN0YXJ0LCBidXQgc2hvdWxkIGJlIHJlbW92ZWQgaWYgbm90XG4gICAgLy8gcmV0dXJuIHNlbGY7XG4gIH1cbiAgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldFN0ZXBDb3VudChzZXF1ZW5jZU51bWJlcikge1xuICAgIHJldHVybiB0aGlzLnN0ZXBDb3VudCArIHNlcXVlbmNlTnVtYmVyO1xuICB9XG5cbiAgZ2V0Q3VycmVudFNlcXVlbmNlKCkge1xuICAgIHJldHVybiB0aGlzLnN0ZXBDb3VudCAlIHRoaXMuc2VxdWVuY2VMZW5ndGg7XG4gIH1cblxuICBjYWxjdWxhdGVTdGVwUnVuVGltZShzdGVwTnVtYmVyKSB7XG4gICAgaWYgKHN0ZXBOdW1iZXIgPCAwKXJldHVybiBudWxsO1xuICAgIC8vIGlmICgoc3RlcE51bWJlciA8PSAwKSB8fCAoc3RlcE51bWJlciA8IHRoaXMuc3RlcENvdW50KSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWUoKSArIChzdGVwTnVtYmVyICogdGhpcy5zZWNQZXJTdGVwKTtcbiAgfVxufVxuXG4iLCJjbGFzcyBTdGVwQWN0aW9uIHtcbiAgY29uc3RydWN0b3IodGFyZ2V0LCB2YWx1ZSkge1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RlcCB7XG4gIGNvbnN0cnVjdG9yKGlkLCBhY3Rpb25zID0gW10pIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5hY3Rpb25zID0gYWN0aW9uczsgLy8gU3RlcEFjdGlvblxuICB9XG4gIHNjaGVkdWxlQWN0aW9ucyh0aW1lKSB7XG4gICAgLy8gU2NoZWR1bGUgZWFjaCBvZiB0aGUgYWN0aW9ucyBmb3IgYSBzdGVwIHRvIG9jY3VyIGF0IHRoZSBzYW1lIHRpbWVcbiAgICB0aGlzLmFjdGlvbnMuZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBhY3Rpb24udGFyZ2V0O1xuICAgICAgY29uc3QgdmFsdWUgPSBhY3Rpb24udmFsdWU7XG4gICAgICB0YXJnZXQuc2V0VmFsdWVBdFRpbWUodmFsdWUsIHRpbWUpOyAvLyBGSVhNRSBQRVJGIGhvcGVmdWxseSBiaWcgb2JqIG5vdCBwYXNzZWQgYnkgdmFsdWVcbiAgICAgIC8vIGNvbnN0IHRhcmdldCA9IHN5bnRoLmtleXNbdGFyZ2V0XTsgbG9va3VwIHZpYSBzeW50aFxuICAgIH0pO1xuICB9XG4gIG5ld0FjdGlvbih0YXJnZXQsIHZhbHVlKSB7XG4gICAgY29uc3QgYWN0aW9uID0gbmV3IFN0ZXBBY3Rpb24odGFyZ2V0LCB2YWx1ZSk7XG4gICAgdGhpcy5hZGRBY3Rpb24oYWN0aW9uKTtcbiAgfVxuICBhZGRBY3Rpb24oYWN0aW9uKSB7XG4gICAgLy8gVE9ETyBDb3VsZCBjaGVjayBmb3IgZHVwZXMgYnV0IGxhc3QgdmFsID0gdGhlIGZpbmFsIHNldCBkdXJpbmcgc2NoZWR1bGluZ1xuICAgIHRoaXMuYWN0aW9ucy5wdXNoKGFjdGlvbik7XG4gIH1cbiAgcmVtb3ZlQWN0aW9ucygpIHtcbiAgICAvLyBXb3VsZCBsaWtlIHRvIGRvIHNpbmdsZSByZW1vdmFsIGJ1dCB3b3VsZCBuZWVkIHdheSB0byB0cmFjayBhY3Rpb25zXG4gICAgLy8gTkJEIGZvciBrZXkgb24gLyBvZmYgdGhvdWdoLCBzaW5jZSBrZXkgY291bGQgYmUgaWQgdG8gcmVwbGFjZVxuICAgIHRoaXMuYWN0aW9ucyA9IFtdO1xuICB9XG59XG5cbiIsImltcG9ydCB7IENvbnZlcnQgfSBmcm9tICcuL2NvbnZlcnQuZXM2JztcbmV4cG9ydCBjbGFzcyBTeW50aCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRleHQsIG91dHB1dCkge1xuICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLm91dHB1dCA9IG91dHB1dDtcbiAgICB0aGlzLm9zY2lsbGF0b3JzID0ge307XG4gICAgdGhpcy5nYWlucyA9IHt9O1xuICB9XG4gIGNyZWF0ZU5vdGUoaW5wdXROb3RlKSB7XG4gICAgbGV0IGZyZXE7XG4gICAgaWYgKHR5cGVvZiBpbnB1dE5vdGUgPT09ICdudW1iZXInKSB7XG4gICAgICBmcmVxID0gaW5wdXROb3RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcmVxID0gQ29udmVydC5mcmVxRnJvbU5vdGUoaW5wdXROb3RlKTtcbiAgICB9XG4gICAgY29uc3Qgb3NjID0gdGhpcy5jcmVhdGVPc2NpbGxhdG9yKGZyZXEpO1xuICAgIGNvbnN0IGdhaW4gPSB0aGlzLmNyZWF0ZUdhaW4oKTtcbiAgICBvc2MuY29ubmVjdChnYWluKTtcbiAgICBvc2Muc3RhcnQoKTtcbiAgICB0aGlzLm9zY2lsbGF0b3JzW2lucHV0Tm90ZV0gPSBvc2M7XG4gICAgdGhpcy5nYWluc1tpbnB1dE5vdGVdID0gZ2FpbjtcbiAgfVxuXG4gIGNyZWF0ZUdhaW4oKSB7XG4gICAgY29uc3QgZyA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICBnLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICAgIGcuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgcmV0dXJuIGc7XG4gIH1cblxuICBjcmVhdGVPc2NpbGxhdG9yKCBmcmVxLCB0eXBlID0gJ3NpbmUnKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICBvLnR5cGUgPSB0eXBlO1xuICAgIG8uZnJlcXVlbmN5LnZhbHVlID0gZnJlcTtcbiAgICByZXR1cm4gbztcbiAgfVxuICB0b2dnbGUoa2V5LCBvbikge1xuICAgIGlmIChvbikge1xuICAgICAgdGhpcy5vbihrZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9mZihrZXkpO1xuICAgIH1cbiAgfVxuICBvbihrZXksIHZvbHVtZSA9IDAuNSkge1xuICAgIHRoaXMuZ2FpbnNba2V5XS5nYWluLnZhbHVlID0gdm9sdW1lO1xuICB9XG4gIG9mZihrZXkpIHtcbiAgICB0aGlzLmdhaW5zW2tleV0uZ2Fpbi52YWx1ZSA9IDA7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbnZlcnQgfSBmcm9tICcuL2NvbnZlcnQuZXM2JztcblxuZXhwb3J0IGNsYXNzIFVJIHtcblxuICBzdGF0aWMgbWFrZUtleShub3RlLCB0b2dnbGVBY3Rpb24pIHtcbiAgICBjb25zdCBrZXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBrZXkuaWQgPSBub3RlO1xuICAgIGtleS5jbGFzc0xpc3QuYWRkKCdrZXknKTtcbiAgICBsZXQgbGFiZWw7XG4gICAgbGV0IGZyZXE7IFxuICAgIGlmICh0eXBlb2Ygbm90ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGZyZXEgPSBDb252ZXJ0LmZyZXFGcm9tTm90ZShub3RlKTtcbiAgICAgIGxhYmVsID0gbm90ZS5yZXBsYWNlKCdiJywgJ+KZrScpO1xuICAgICAgaWYgKG5vdGUubWF0Y2goJ2InKSkga2V5LmNsYXNzTGlzdC5hZGQoJ2Vib255Jyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygbm90ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGZyZXEgPSBub3RlO1xuICAgICAgbGFiZWwgPSBTdHJpbmcoQ29udmVydC5yb3VuZChmcmVxLCAxKSk7XG4gICAgfVxuICAgIGtleS5pbm5lckhUTUwgPSBsYWJlbFxuICAgIGtleS5kYXRhc2V0LmZyZXF1ZW5jeSA9IENvbnZlcnQucm91bmQoZnJlcSwgMyk7XG4gICAga2V5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlQWN0aW9uKTtcbiAgICByZXR1cm4ga2V5O1xuICB9XG5cbiAgc3RhdGljIG1ha2VTdGVwKG51bSkge1xuICAgIGlmICghbnVtKSB0aHJvdyBFcnJvciAoJ25vIHN0ZXAgbnVtYmVyJyk7XG4gICAgY29uc3Qgc3RlcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0ZXAuaWQgPSBgc3RlcC0ke251bX1gO1xuICAgIHN0ZXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZXF1ZW5jZSk7XG4gICAgcmV0dXJuIHN0ZXA7XG4gIH1cblxuICBzdGF0aWMgbWFrZUNob2ljZShhY3Rpb24sIGxhYmVsKSB7XG4gICAgaWYgKCFhY3Rpb24pIHRocm93IEVycm9yICgnbm8gY2hvaWNlIGFjdGlvbicpO1xuICAgIGlmICghbGFiZWwpIHRocm93IEVycm9yICgnbm8gY2hvaWNlIGxhYmVsJyk7XG4gICAgY29uc3QgY2hvaWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY2hvaWNlLmlkID0gJ2Nob2ljZS0ke2xhYmVsfSc7XG4gICAgY2hvaWNlLmNsYXNzTGlzdC5hZGQoJ2tleScpO1xuICAgIGNob2ljZS5jbGFzc0xpc3QuYWRkKCdjaG9pY2UnKTtcbiAgICBjaG9pY2UuaW5uZXJIVE1MID0gbGFiZWw7XG4gICAgY2hvaWNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWN0aW9uKTtcbiAgICByZXR1cm4gY2hvaWNlO1xuICB9XG5cbiAgc3RhdGljIG1ha2VTdG9wKGFjdGlvbikge1xuICAgIGlmICghYWN0aW9uKSB0aHJvdyBFcnJvciAoJ25vIHN0b3AgYWN0aW9uJyk7XG4gICAgY29uc3Qgc3RvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0b3AuaWQgPSAnc3RvcCdcbiAgICBzdG9wLmNsYXNzTGlzdC5hZGQoJ3N0b3AnKTtcbiAgICBzdG9wLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWN0aW9uKTtcbiAgICByZXR1cm4gc3RvcDtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlUGxheShhY3Rpb24pIHtcbiAgICBpZiAoIWFjdGlvbikgdGhyb3cgRXJyb3IgKCdubyBwbGF5IGFjdGlvbicpO1xuICAgIGNvbnN0IHBsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5LmlkID0gJ3BsYXknXG4gICAgcGxheS5jbGFzc0xpc3QuYWRkKCdwbGF5Jyk7XG4gICAgcGxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjdGlvbik7XG4gICAgcmV0dXJuIHBsYXk7XG4gIH1cblxuICBzdGF0aWMgdG9nZ2xlKG5vdGUpIHtcbiAgICBjb25zdCBrZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChub3RlKTtcbiAgICBjb25zdCBvbiA9IGtleS5jbGFzc0xpc3QudG9nZ2xlKCdvbicpO1xuICAgIHJldHVybiBvbjtcbiAgfVxufVxuXG4iXX0=
