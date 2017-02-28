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

function getContent() {
  return document.getElementById('content');
}

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

function createSinglet(note, keyboard) {
  var syn = synth.createNote(note);
  var action = function action(event) {
    if (event.key == keyboard) {
      var on = _ui.UI.toggle(note);
      synth.toggle(note, on);
    }
    console.log(event.key);
  };
  var ui = _ui.UI.makeSinglet(note, action, keyboard);
  return { syn: syn, ui: ui };
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
  var octaveDivisions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 33;

  return function () {
    content.innerHTML = '';
    getFreqsFromDivisions(octaveDivisions).forEach(function (freq) {
      return createSynthKey(freq);
    });
    areKeysPresent();
  };
}

function singlets() {
  var octaveDivisions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 33;

  return function () {
    content.innerHTML = '';
    content.classList.add('keyboard');
    var freqs = getFreqsFromDivisions(octaveDivisions);
    var keyboard = getKeyboardFromDivisions(octaveDivisions);
    for (var i = 0; i < freqs.length;) {
      var triplet = [];
      for (var j = 0; j < 3; j++) {
        var _createSinglet = createSinglet(freqs[i], keyboard[i]),
            _ = _createSinglet._,
            ui = _createSinglet.ui;

        triplet.push(ui);
        i++;
      }
      _ui.UI.makeTriplet(triplet, getContent());
    }
    areKeysPresent();
  };
}

function getFreqsFromDivisions() {
  var octaveDivisions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 33;

  var freqs = [];
  for (var i = 0; i < octaveDivisions; i++) {
    var freq = 440 + i * (440 / octaveDivisions);
    freqs.push(freq);
  }
  return freqs;
}

function getKeyboardFromDivisions() {
  var octaveDivisions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 33;

  var keyboard = ['q', 'a', 'z', 'w', 's', 'x', 'e', 'd', 'c', 'r', 'f', 'v', 't', 'g', 'b', 'y', 'h', 'n', 'u', 'j', 'm', 'i', 'k', ',', 'o', 'l', '.', 'p', ';', '/', '[', "'", ']'];
  return keyboard;
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
  return function (event) {
    if (event.key !== ' ') return event;
    for (var g in synth.gains) {
      synth.gains[g].gain.value = 0;
    }
    var onKeys = Array.from(content.getElementsByClassName('on'));
    onKeys.forEach(function (el) {
      return el.classList.remove('on');
    });
    event.preventDefault();
  };
}

/* Not working
A. dont know how to use intervals to make loops
B. scheduled changes arent stopped by clearInterval anyway
content.appendChild(UI.makeStop(stop));
const stop = (looper) => clearInterval(looper);
*/
_ui.UI.attachMessage2U(content);
var choices = document.createElement('div');
choices.classList.add('choices');
content.appendChild(choices);

choices.appendChild(_ui.UI.makeChoice(singlets(33), "keyboard µtuning \'33"));
choices.appendChild(_ui.UI.makeChoice(mikros(24), "microtuning \'24"));
choices.appendChild(_ui.UI.makeChoice(mikros(50), "microtuning \'50"));
choices.appendChild(_ui.UI.makeChoice(mikros(99), "microtuning \'99"));
choices.appendChild(_ui.UI.makeChoice(normal(), 'normal keys'));

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
    key: 'toggle',
    value: function toggle(note) {
      var key = document.getElementById(note);
      var on = key.classList.toggle('on');
      return on;
    }
  }, {
    key: 'makeKey',
    value: function makeKey(note, toggleAction) {
      var key = document.createElement('div');
      key.id = note;
      key.classList.add('key');

      var _getLabelAndFreq = getLabelAndFreq(note),
          label = _getLabelAndFreq.label,
          freq = _getLabelAndFreq.freq;

      key.innerHTML = label;
      key.dataset.frequency = _convert.Convert.round(freq, 3);
      key.addEventListener('click', toggleAction);
      return key;
    }
  }, {
    key: 'makeSinglet',
    value: function makeSinglet(note, toggleAction, keyboard) {
      var singlet = document.createElement('div');
      singlet.id = note;
      singlet.classList.add('key');
      singlet.classList.add('singlet');

      var _getLabelAndFreq2 = getLabelAndFreq(note),
          label = _getLabelAndFreq2.label,
          freq = _getLabelAndFreq2.freq;

      singlet.innerHTML = keyboard || label;
      singlet.dataset.frequency = _convert.Convert.round(freq, 3);
      window.addEventListener('keydown', toggleAction);
      return singlet;
    }
  }, {
    key: 'makeTriplet',
    value: function makeTriplet(triplet, target) {
      var trip = document.createElement('div');
      trip.classList.add('triplet');
      if (target) {
        triplet.forEach(function (s) {
          return trip.appendChild(s);
        });
        target.appendChild(trip);
        return self;
      }
      return trip;
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
    key: 'attachMessage2U',
    value: function attachMessage2U(targetNode) {
      var text = document.createElement('p');
      text.classList.add('message-2-u');
      text.innerHTML = 'press space key to stop sounds';
      targetNode.appendChild(text);
    }
  }]);

  return UI;
}();

function getLabelAndFreq(note) {
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
  return { label: label, freq: freq };
}

},{"./convert.es6":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmVzNiIsInNyYy9jb252ZXJ0LmVzNiIsInNyYy9zZXF1ZW5jZXIuZXM2Iiwic3JjL3N0ZXAuZXM2Iiwic3JjL3N5bnRoLmVzNiIsInNyYy91aS5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUNBOztBQUNBOztBQUVBLElBQUksUUFBUyxPQUFPLFlBQVAsSUFBdUIsT0FBTyxrQkFBM0M7QUFDQSxJQUFNLGVBQWUsSUFBSSxLQUFKLEVBQXJCO0FBQ0EsSUFBTSxTQUFTLGFBQWEsV0FBNUI7O0FBRUEsSUFBSSxRQUFRLGlCQUFVLFlBQVYsRUFBd0IsTUFBeEIsQ0FBWjs7QUFFQSxJQUFNLFVBQVUsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBQWhCOztBQUVBLFNBQVMsVUFBVCxHQUFzQjtBQUNwQixTQUFPLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztBQVVBLFNBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QjtBQUM1QixRQUFNLFVBQU4sQ0FBaUIsSUFBakI7QUFDQSxNQUFNLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDbkIsUUFBTSxLQUFLLE9BQUcsTUFBSCxDQUFVLElBQVYsQ0FBWDtBQUNBLFVBQU0sTUFBTixDQUFhLElBQWIsRUFBbUIsRUFBbkI7QUFDRCxHQUhEO0FBSUEsTUFBTSxNQUFNLE9BQUcsT0FBSCxDQUFXLElBQVgsRUFBaUIsTUFBakIsQ0FBWjtBQUNBLFVBQVEsV0FBUixDQUFvQixHQUFwQjtBQUNEOztBQUVELFNBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QixRQUE3QixFQUF1QztBQUNyQyxNQUFNLE1BQU0sTUFBTSxVQUFOLENBQWlCLElBQWpCLENBQVo7QUFDQSxNQUFNLFNBQVMsU0FBVCxNQUFTLENBQUMsS0FBRCxFQUFXO0FBQ3hCLFFBQUksTUFBTSxHQUFOLElBQWEsUUFBakIs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QixDQUFiO0FBQ0EsV0FBSyxFQUFMLEdBQVUsTUFBVjtBQUNBLFdBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsTUFBbkI7QUFDQSxXQUFLLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLE1BQS9CO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7OztvQ0FFc0IsVSxFQUFZO0FBQ2pDLFVBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBYjtBQUNBLFdBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsYUFBbkI7QUFDQSxXQUFLLFNBQUwsR0FBZ0IsZ0NBQWhCO0FBQ0EsaUJBQVcsV0FBWCxDQUF1QixJQUF2QjtBQUNEOzs7Ozs7QUFLSCxTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBK0I7QUFDN0IsTUFBSSxjQUFKO0FBQ0EsTUFBSSxhQUFKO0FBQ0EsTUFBSSxPQUFPLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDNUIsV0FBTyxpQkFBUSxZQUFSLENBQXFCLElBQXJCLENBQVA7QUFDQSxZQUFRLEtBQUssT0FBTCxDQUFhLEdBQWIsRUFBa0IsR0FBbEIsQ0FBUjtBQUNBLFFBQUksS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFKLEVBQXFCLElBQUksU0FBSixDQUFjLEdBQWQsQ0FBa0IsT0FBbEI7QUFDdEIsR0FKRCxNQUlPLElBQUksT0FBTyxJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQ25DLFdBQU8sSUFBUDtBQUNBLFlBQVEsT0FBTyxpQkFBUSxLQUFSLENBQWMsSUFBZCxFQUFvQixDQUFwQixDQUFQLENBQVI7QUFDRDtBQUNELFNBQU8sRUFBRSxZQUFGLEVBQVMsVUFBVCxFQUFQO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgU3ludGggfSBmcm9tICcuL3N5bnRoLmVzNic7XG5pbXBvcnQgeyBVSSB9IGZyb20gJy4vdWkuZXM2JztcbmltcG9ydCB7IFNlcXVlbmNlciB9IGZyb20gJy4vc2VxdWVuY2VyLmVzNic7XG5cbnZhciBhdWRpbyA9ICB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5jb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgYXVkaW8oKTtcbmNvbnN0IG91dHB1dCA9IGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbjtcblxubGV0IHN5bnRoID0gbmV3IFN5bnRoKGF1ZGlvQ29udGV4dCwgb3V0cHV0KTtcblxuY29uc3QgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jyk7XG5cbmZ1bmN0aW9uIGdldENvbnRlbnQoKSB7XG4gIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xufVxuXG4vKlxuY29uc3QgZmlsdGVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuZmlsdGVyLnR5cGUgPSAnbG93c2hlbGYnO1xuZmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IDg4MDtcbmZpbHRlci5nYWluLnZhbHVlID0gMjU7XG5maWx0ZXIuY29ubmVjdChvdXRwdXQpO1xubGV0IHN5bnRoID0gbmV3IFN5bnRoKGF1ZGlvQ29udGV4dCwgZmlsdGVyKTtcbiovXG5cblxuZnVuY3Rpb24gY3JlYXRlU3ludGhLZXkobm90ZSkge1xuICBzeW50aC5jcmVhdGVOb3RlKG5vdGUpO1xuICBjb25zdCBhY3Rpb24gPSAoKSA9PiB7XG4gICAgY29uc3Qgb24gPSBVSS50b2dnbGUobm90ZSk7XG4gICAgc3ludGgudG9nZ2xlKG5vdGUsIG9uKTtcbiAgfTtcbiAgY29uc3Qga2V5ID0gVUkubWFrZUtleShub3RlLCBhY3Rpb24pO1xuICBjb250ZW50LmFwcGVuZENoaWxkKGtleSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpbmdsZXQobm90ZSwga2V5Ym9hcmQpIHtcbiAgY29uc3Qgc3luID0gc3ludGguY3JlYXRlTm90ZShub3RlKTtcbiAgY29uc3QgYWN0aW9uID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSA9PSBrZXlib2FyZCkge1xuICAgICAgY29uc3Qgb24gPSBVSS50b2dnbGUobm90ZSk7XG4gICAgICBzeW50aC50b2dnbGUobm90ZSwgb24pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhldmVudC5rZXkpO1xuICB9O1xuICBjb25zdCB1aSA9IFVJLm1ha2VTaW5nbGV0KG5vdGUsIGFjdGlvbiwga2V5Ym9hcmQpO1xuICByZXR1cm4geyBzeW4gLCB1aSB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWwoKSB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgY29udGVudC5pbm5lckhUTUwgPSAnJztcbiAgICBsZXQgbm90ZXMgPSBbICdBNCcsICdCYjQnLCAnQjQnLCAnQzQnLCAnRGI0JywgJ0Q0JywgJ0ViNCcsICdFNCcsICdGNCcsICdHYjQnLCAnRzQnLCAnQWI1JywgJ0E1J107XG4gICAgbm90ZXMuZm9yRWFjaChub3RlID0+IGNyZWF0ZVN5bnRoS2V5KG5vdGUpKTtcbiAgICBhZGRTZXF1ZW5jZXIoKTtcbiAgICBhcmVLZXlzUHJlc2VudCgpO1xuICB9XG59IFxuXG4vLyDOvM65zrrPgc+Mz4IgdG9uYWxcbmZ1bmN0aW9uIG1pa3JvcyhvY3RhdmVEaXZpc2lvbnMgPSAzMykge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgZ2V0RnJlcXNGcm9tRGl2aXNpb25zKG9jdGF2ZURpdmlzaW9ucylcbiAgICAgIC5mb3JFYWNoKGZyZXEgPT4gY3JlYXRlU3ludGhLZXkoZnJlcSkpO1xuICAgIGFyZUtleXNQcmVzZW50KCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2luZ2xldHMob2N0YXZlRGl2aXNpb25zID0gMzMpIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBjb250ZW50LmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgna2V5Ym9hcmQnKTtcbiAgICBjb25zdCBmcmVxcyA9IGdldEZyZXFzRnJvbURpdmlzaW9ucyhvY3RhdmVEaXZpc2lvbnMpO1xuICAgIGNvbnN0IGtleWJvYXJkID0gZ2V0S2V5Ym9hcmRGcm9tRGl2aXNpb25zKG9jdGF2ZURpdmlzaW9ucyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmVxcy5sZW5ndGg7KSB7XG4gICAgICBsZXQgdHJpcGxldCA9IFtdO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgICAgY29uc3QgeyBfLCB1aSB9ID0gY3JlYXRlU2luZ2xldChmcmVxc1tpXSwga2V5Ym9hcmRbaV0pO1xuICAgICAgICB0cmlwbGV0LnB1c2godWkpO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBVSS5tYWtlVHJpcGxldCh0cmlwbGV0LCBnZXRDb250ZW50KCkpO1xuICAgIH1cbiAgICBhcmVLZXlzUHJlc2VudCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEZyZXFzRnJvbURpdmlzaW9ucyhvY3RhdmVEaXZpc2lvbnMgPSAzMykge1xuICBjb25zdCBmcmVxcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG9jdGF2ZURpdmlzaW9uczsgaSsrKSB7XG4gICAgbGV0IGZyZXEgPSA0NDAgKyBpICogKDQ0MCAvIG9jdGF2ZURpdmlzaW9ucyk7XG4gICAgZnJlcXMucHVzaChmcmVxKTtcbiAgfVxuICByZXR1cm4gZnJlcXM7XG59XG5cbmZ1bmN0aW9uIGdldEtleWJvYXJkRnJvbURpdmlzaW9ucyhvY3RhdmVEaXZpc2lvbnMgPSAzMykge1xuICBjb25zdCBrZXlib2FyZCA9IFsgXG4gICdxJywgJ2EnLCAneicsICd3JywgJ3MnLCAneCcsICdlJywgJ2QnLCAnYycsICdyJywgJ2YnLCAndicsICd0JywgJ2cnLCAnYicsICd5JywgJ2gnLCAnbicsICd1JywgJ2onLCAnbScsICdpJywgJ2snLCAnLCcsICdvJywgJ2wnLCAnLicsICdwJywgJzsnLCAnLycsICdbJywgXCInXCIsICddJyBdO1xuICByZXR1cm4ga2V5Ym9hcmQ7XG59XG5cbmZ1bmN0aW9uIGFyZUtleXNQcmVzZW50KCkge1xuICBpZiAoY29udGVudC5jaGlsZEVsZW1lbnRDb3VudCkge1xuICAgIGNvbnNvbGUubG9nKCdzdXJmaW4gb24gc2luZSB3YXZlcycpO1xuICB9IGVsc2Uge1xuICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gJ2Jyb2tlIGl0IMKvXFxcXF8o44OEKV8vwq8nO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZFNlcXVlbmNlcigpIHtcbiAgY29uc3Qgc2VxdWVuY2VyID0gbmV3IFNlcXVlbmNlcihhdWRpb0NvbnRleHQsIDkwKTtcbiAgc2VxdWVuY2VyLm5ld0FjdGlvbigxLCBzeW50aC5nYWluc1snQTQnXS5nYWluLCAxKTtcbiAgc2VxdWVuY2VyLm5ld0FjdGlvbigyLCBzeW50aC5nYWluc1snQTQnXS5nYWluLCAwKTtcblxuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDIsIHN5bnRoLmdhaW5zWydCNCddLmdhaW4sIDEpO1xuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDMsIHN5bnRoLmdhaW5zWydCNCddLmdhaW4sIDApO1xuXG4gIHNlcXVlbmNlci5uZXdBY3Rpb24oMywgc3ludGguZ2FpbnNbJ0M0J10uZ2FpbiwgMSk7XG4gIHNlcXVlbmNlci5uZXdBY3Rpb24oNCwgc3ludGguZ2FpbnNbJ0M0J10uZ2FpbiwgMCk7XG5cbiAgc2VxdWVuY2VyLm5ld0FjdGlvbig1LCBzeW50aC5nYWluc1snRzQnXS5nYWluLCAxKTtcbiAgc2VxdWVuY2VyLm5ld0FjdGlvbig5LCBzeW50aC5nYWluc1snRzQnXS5nYWluLCAwKTtcblxuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDksIHN5bnRoLmdhaW5zWydBNCddLmdhaW4sIDEpO1xuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDExLCBzeW50aC5nYWluc1snQTQnXS5nYWluLCAwKTtcblxuICBzZXF1ZW5jZXIubmV3QWN0aW9uKDExLCBzeW50aC5nYWluc1snRzQnXS5nYWluLCAxKTtcbiAgc2VxdWVuY2VyLm5ld0FjdGlvbigxOSwgc3ludGguZ2FpbnNbJ0c0J10uZ2FpbiwgMCk7XG5cbiAgY29uc3QgbG9vcCA9ICgpID0+IHtcbiAgICBjb25zdCBsYXN0ID0gc2VxdWVuY2VyLnNjaGVkdWxlU2VxdWVuY2UoKTtcbiAgICBjb25zdCBuZXh0ID0gbGFzdCAqIDEwMDA7XG4gICAgY29uc29sZS5sb2coYG5leHQgJHtuZXh0fWApXG4gIH07XG4gIGNvbnRlbnQuYXBwZW5kQ2hpbGQoVUkubWFrZVBsYXkobG9vcCkpO1xufVxuXG5mdW5jdGlvbiBzdG9wQWxsKGV2ZW50KSB7XG4gIHJldHVybiAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQua2V5ICE9PSAnICcpIHJldHVybiBldmVudDtcbiAgICBmb3IgKGxldCBnIGluIHN5bnRoLmdhaW5zKSB7XG4gICAgICBzeW50aC5nYWluc1tnXS5nYWluLnZhbHVlID0gMDtcbiAgICB9XG4gICAgY29uc3Qgb25LZXlzID0gQXJyYXkuZnJvbShjb250ZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ29uJykpO1xuICAgIG9uS2V5cy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ29uJykpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG59XG5cbi8qIE5vdCB3b3JraW5nXG5BLiBkb250IGtub3cgaG93IHRvIHVzZSBpbnRlcnZhbHMgdG8gbWFrZSBsb29wc1xuQi4gc2NoZWR1bGVkIGNoYW5nZXMgYXJlbnQgc3RvcHBlZCBieSBjbGVhckludGVydmFsIGFueXdheVxuY29udGVudC5hcHBlbmRDaGlsZChVSS5tYWtlU3RvcChzdG9wKSk7XG5jb25zdCBzdG9wID0gKGxvb3BlcikgPT4gY2xlYXJJbnRlcnZhbChsb29wZXIpO1xuKi9cblVJLmF0dGFjaE1lc3NhZ2UyVShjb250ZW50KTtcbmNvbnN0IGNob2ljZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmNob2ljZXMuY2xhc3NMaXN0LmFkZCgnY2hvaWNlcycpO1xuY29udGVudC5hcHBlbmRDaGlsZChjaG9pY2VzKTtcblxuY2hvaWNlcy5hcHBlbmRDaGlsZChVSS5tYWtlQ2hvaWNlKHNpbmdsZXRzKDMzKSwgXCJrZXlib2FyZCDCtXR1bmluZyBcXCczM1wiKSk7XG5jaG9pY2VzLmFwcGVuZENoaWxkKFVJLm1ha2VDaG9pY2UobWlrcm9zKDI0KSwgXCJtaWNyb3R1bmluZyBcXCcyNFwiKSk7XG5jaG9pY2VzLmFwcGVuZENoaWxkKFVJLm1ha2VDaG9pY2UobWlrcm9zKDUwKSwgXCJtaWNyb3R1bmluZyBcXCc1MFwiKSk7XG5jaG9pY2VzLmFwcGVuZENoaWxkKFVJLm1ha2VDaG9pY2UobWlrcm9zKDk5KSwgXCJtaWNyb3R1bmluZyBcXCc5OVwiKSk7XG5jaG9pY2VzLmFwcGVuZENoaWxkKFVJLm1ha2VDaG9pY2Uobm9ybWFsKCksICdub3JtYWwga2V5cycpKTtcblxuYXJlS2V5c1ByZXNlbnQoKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgc3RvcEFsbCgpKTtcblxuXG4iLCJjb25zdCBub3RlcyA9IFsgJ0EnLCAnQmInLCAnQicsICdDJywgJ0RiJywgJ0QnLCAnRWInLCAnRScsICdGJywgJ0diJywgJ0cnXTtcblxuZXhwb3J0IGNsYXNzIENvbnZlcnQge1xuXG4gIHN0YXRpYyBmcmVxRnJvbVN0ZXAoc3RlcHMsIGZpeGVkID0gNDQwKSB7XG4gICAgY29uc3QgYSA9IDIgKiogKDEvMTIpO1xuICAgIHJldHVybiBmaXhlZCAqIE1hdGgucG93KGEsIHN0ZXBzKTtcbiAgfVxuXG4gIHN0YXRpYyBub3RlRnJvbVN0ZXAoc3RlcCkge1xuICAgIGNvbnN0IG5vdGUgPSBzdGVwICUgbm90ZXMubGVuZ3RoO1xuICAgIHJldHVybiBub3Rlc1tub3RlXTtcbiAgfVxuXG4gIHN0YXRpYyBzdHJpbmdUb05vdGUoc3RyKSB7XG4gICAgY29uc3Qgb2N0YXZlSW5kZXggPSBzdHIubWF0Y2goL1swLTldLykuaW5kZXg7XG4gICAgY29uc3Qgb2N0YXZlID0gc3RyLnNsaWNlKG9jdGF2ZUluZGV4KTtcbiAgICBjb25zdCBub3RlID0gc3RyLnNsaWNlKDAsIG9jdGF2ZUluZGV4KTtcbiAgICByZXR1cm4geyBub3RlLCBvY3RhdmUgfTtcbiAgfVxuXG4gIHN0YXRpYyBmcmVxRnJvbU5vdGUoaW5wdXROb3RlKSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dE5vdGUgIT09ICdzdHJpbmcnKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCB7IG5vdGUsIG9jdGF2ZSB9ID0gIENvbnZlcnQuc3RyaW5nVG9Ob3RlKGlucHV0Tm90ZSk7XG4gICAgY29uc3Qgc2VtaSA9IG5vdGVzLmluZGV4T2Yobm90ZSk7XG4gICAgbGV0IGZyZXEgPSBDb252ZXJ0LmZyZXFGcm9tU3RlcChzZW1pKTtcbiAgICBsZXQgZGlmZiA9IG9jdGF2ZSAtIDQ7XG4gICAgbGV0IGRpciA9IE1hdGguc2lnbihkaWZmKTtcbiAgICB3aGlsZSAoZGlmZikge1xuICAgICAgaWYgKGRpciA9PT0gMSkge1xuICAgICAgICBmcmVxICo9IDI7XG4gICAgICAgIGRpZmYtLTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZyZXEgLz0gMjtcbiAgICAgICAgZGlmZisrO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGZyZXE7XG4gIH1cblxuICBzdGF0aWMgcm91bmQobnVtYmVyLCBwcmVjaXNpb24pIHtcbiAgICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcbiAgICAgIHZhciB0ZW1wTnVtYmVyID0gbnVtYmVyICogZmFjdG9yO1xuICAgICAgdmFyIHJvdW5kZWRUZW1wTnVtYmVyID0gTWF0aC5yb3VuZCh0ZW1wTnVtYmVyKTtcbiAgICAgIHJldHVybiByb3VuZGVkVGVtcE51bWJlciAvIGZhY3RvcjtcbiAgfTtcbn1cbiIsImltcG9ydCB7IFN0ZXAgfSBmcm9tICcuL3N0ZXAuZXM2JztcblxuZXhwb3J0IGNsYXNzIFNlcXVlbmNlciB7XG4gIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgYnBtID0gMTIwKSB7XG4gICAgdGhpcy5jb250ZXh0ID0gYXVkaW9Db250ZXh0O1xuICAgIHRoaXMuYnBtID0gYnBtO1xuICAgIHRoaXMuc3RlcENvdW50ID0gMDtcbiAgICB0aGlzLnNlcXVlbmNlTGVuZ3RoID0gMjQ7IC8vIGZpeGVkIFRPRE9cbiAgICB0aGlzLmJlYXRzUGVyU2VxdWVuY2UgPSA0OyAvLyBmaXhlZCBUT0RPXG4gICAgLy8gYnBtIC8gNjAgPSBiZWF0cyBwZXIgc2VjXG4gICAgY29uc3QgYnBzID0gdGhpcy5icG0gLyA2MDtcbiAgICAvLyBicHMgKiBzdGVwcy9iZWF0ID0gc3RlcHMgcGVyIHNlY1xuICAgIGNvbnN0IHN0cHMgPSBicHMgKiAodGhpcy5zZXF1ZW5jZUxlbmd0aCAvIHRoaXMuYmVhdHNQZXJTZXF1ZW5jZSk7XG4gICAgLy8gc3BzICoqIC0xID0gc2VjIHBlciBzdGVwXG4gICAgdGhpcy5zZWNQZXJTdGVwID0gTWF0aC5wb3coc3RwcywgLTEpO1xuICAgIHRoaXMubGFzdFNjaGVkdWxlZFRpbWUgPSAwO1xuICAgIHRoaXMuc2VxdWVuY2UgPSBBcnJheSh0aGlzLnNlcXVlbmNlTGVuZ3RoKTtcbiAgICB0aGlzLmxvb3BpbmcgPSBmYWxzZTtcbiAgfVxuICBydW4oKSB7XG4gICAgbGV0IHJlc3RhcnRUaW1lID0gdGhpcy5sYXN0U2NoZWR1bGVkVGltZSAtIHRoaXMuY3VycmVudFRpbWUoKTtcbiAgICBpZiAocmVzdGFydFRpbWUgPCAwKSB7XG4gICAgICByZXN0YXJ0VGltZSA9IDA7XG4gICAgfVxuICAgIC8vIFRPRE8gUEVSRiBsYXRlbmN5IHZlcnkgcG9zc2libGUgd2l0aCBzZXRUaW1lb3V0XG4gICAgLy8gV291bGQgbGlrZSBjYWxsYmFjayBvbiBzY2hlZHVsZSBmaW5pc2hlZCB0byBydW4gYW5vdGhlciBpbnN0YW5jZSBvZiBzY2hlZHVsZVNlcXVlbmNlXG4gICAgd2luZG93LnNldFRpbWVvdXQodGhpcy5zY2hlZHVsZVNlcXVlbmNlLCByZXN0YXJ0VGltZSk7XG4gIH1cbiAgbG9vcCgpIHtcbiAgICB0aGlzLmxvb3BpbmcgPSB0cnVlO1xuICAgIHRoaXMuc2NoZWR1bGVTZXF1ZW5jZSgpOyAvLyBzY2hlZHVsZSBuZXh0IGxvb3AgJiB3cml0ZSBsYXN0U2NoZWR1bGVkVGltZVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnNlcXVlbmNlLmZvckVhY2goc3RlcCA9PiB7XG4gICAgICBzdGVwLmZvckVhY2goYWN0aW9uID0+IHtcbiAgICAgICAgYWN0aW9uLnRhcmdldC5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG4gIGJvdW5kU3RlcChzZXF1ZW5jZU51bWJlcikge1xuICAgIGlmIChzZXF1ZW5jZU51bWJlciA8IDAgfHwgc2VxdWVuY2VOdW1iZXIgPiB0aGlzLnNlcXVlbmNlTGVuZ3RoKSB7XG4gICAgICBzZXF1ZW5jZU51bWJlciA9IE1hdGgucm91bmQoc2VxdWVuY2VOdW1iZXIgJSB0aGlzLnNlcXVlbmNlTGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcXVlbmNlTnVtYmVyO1xuICB9XG4gIGFkZFN0ZXAoc2VxdWVuY2VOdW1iZXIsIHRhcmdldCwgdmFsdWUpIHtcbiAgICBzZXF1ZW5jZU51bWJlciA9IHRoaXMuYm91bmRTdGVwKHNlcXVlbmNlTnVtYmVyKTtcbiAgICBjb25zdCBzdGVwID0gbmV3IFN0ZXAodGFyZ2V0LCB2YWx1ZSk7XG4gICAgdGhpcy5zZXF1ZW5jZVtzZXF1ZW5jZU51bWJlcl0gPSBzdGVwO1xuICAgIHJldHVybiBzdGVwOyAvLyBGSVhNRSBtYXliZSBzZWxmIGluc3RlYWQgdG8gY2hhaW4gXG4gIH1cbiAgZ2V0U3RlcChzZXF1ZW5jZU51bWJlcikge1xuICAgIHNlcXVlbmNlTnVtYmVyID0gdGhpcy5ib3VuZFN0ZXAoc2VxdWVuY2VOdW1iZXIpO1xuICAgIHJldHVybiB0aGlzLnNlcXVlbmNlW3NlcXVlbmNlTnVtYmVyXTtcbiAgfVxuXG4gIG5ld0FjdGlvbihzZXF1ZW5jZU51bWJlciwgdGFyZ2V0LCB2YWx1ZSkge1xuICAgIGlmICgoc2VxdWVuY2VOdW1iZXIgPCAwKSB8fCAoc2VxdWVuY2VOdW1iZXIgPiB0aGlzLnNlcXVlbmNlLmxlbmd0aCkpIHJldHVybiBudWxsO1xuXG4gICAgbGV0IHN0ZXAgPSB0aGlzLnNlcXVlbmNlW3NlcXVlbmNlTnVtYmVyXTtcbiAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIHRvIGluaXRpYWxpemUgYSBzdGVwIGJlZm9yZSBhZGRpbmcgYWN0aW9uc1xuICAgIGlmICghKHN0ZXAgaW5zdGFuY2VvZiBTdGVwKSkge1xuICAgICAgc3RlcCA9IHRoaXMuYWRkU3RlcChzZXF1ZW5jZU51bWJlcik7XG4gICAgfVxuXG4gICAgc3RlcC5uZXdBY3Rpb24odGFyZ2V0LCB2YWx1ZSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBzY2hlZHVsZVNlcXVlbmNlKHNraXAgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlID0gQXJyYXkodGhpcy5zZXF1ZW5jZUxlbmd0aCk7XG4gICAgZm9yIChsZXQgcyA9IDA7IHMgPCB0aGlzLnNlcXVlbmNlTGVuZ3RoIC0gMTsgcysrKSB7XG4gICAgICAvLyBTY2hlZHVsZSBlYWNoIHN0ZXAgb2YgYSBzZXF1ZW5jZSB+c2VxdWVudGlhbGx5flxuICAgICAgY29uc3QgdGltZSA9IHRoaXMuY2FsY3VsYXRlU3RlcFJ1blRpbWUocyk7XG4gICAgICBpZiAoIXRpbWUpIGNvbnRpbnVlO1xuICAgICAgc2NoZWR1bGUucHVzaCh0aW1lKTtcbiAgICAgIGlmIChza2lwKSBjb250aW51ZTtcblxuICAgICAgLy8gaGF2ZSBzdGVwIHNjaGVkdWxlIGl0J3MgYWN0aW9uc1xuICAgICAgY29uc3Qgc3RlcCA9IHRoaXMuc2VxdWVuY2Vbc107XG4gICAgICB0cnkge1xuICAgICAgICBzdGVwLnNjaGVkdWxlQWN0aW9ucyh0aW1lKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy9za2lwXG4gICAgICB9XG4gICAgICAvLyBUT0RPIEhJR0ggbWlnaHQgbmVlZCBzZXRUaW1lT3V0IHRvIGNhbGwgb3RoZXIgYWN0aW9ucyBhdCB0aW1lLCBidXQgbWlnaHQgYmUgb2ZmXG4gICAgfVxuICAgIHRoaXMubGFzdFNjaGVkdWxlZFRpbWUgPSBzY2hlZHVsZS5zbGljZSgtMSlbMF0gfHwgMDtcblxuICAgIHJldHVybiB0aGlzLmxhc3RTY2hlZHVsZWRUaW1lOyAvLyBDb3VsZCBiZSB1c2VkIGZvciBzY2hlZHVsaW5nIHJlc3RhcnQsIGJ1dCBzaG91bGQgYmUgcmVtb3ZlZCBpZiBub3RcbiAgICAvLyByZXR1cm4gc2VsZjtcbiAgfVxuICBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgZ2V0U3RlcENvdW50KHNlcXVlbmNlTnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RlcENvdW50ICsgc2VxdWVuY2VOdW1iZXI7XG4gIH1cblxuICBnZXRDdXJyZW50U2VxdWVuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RlcENvdW50ICUgdGhpcy5zZXF1ZW5jZUxlbmd0aDtcbiAgfVxuXG4gIGNhbGN1bGF0ZVN0ZXBSdW5UaW1lKHN0ZXBOdW1iZXIpIHtcbiAgICBpZiAoc3RlcE51bWJlciA8IDApcmV0dXJuIG51bGw7XG4gICAgLy8gaWYgKChzdGVwTnVtYmVyIDw9IDApIHx8IChzdGVwTnVtYmVyIDwgdGhpcy5zdGVwQ291bnQpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZSgpICsgKHN0ZXBOdW1iZXIgKiB0aGlzLnNlY1BlclN0ZXApO1xuICB9XG59XG5cbiIsImNsYXNzIFN0ZXBBY3Rpb24ge1xuICBjb25zdHJ1Y3Rvcih0YXJnZXQsIHZhbHVlKSB7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdGVwIHtcbiAgY29uc3RydWN0b3IoaWQsIGFjdGlvbnMgPSBbXSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zOyAvLyBTdGVwQWN0aW9uXG4gIH1cbiAgc2NoZWR1bGVBY3Rpb25zKHRpbWUpIHtcbiAgICAvLyBTY2hlZHVsZSBlYWNoIG9mIHRoZSBhY3Rpb25zIGZvciBhIHN0ZXAgdG8gb2NjdXIgYXQgdGhlIHNhbWUgdGltZVxuICAgIHRoaXMuYWN0aW9ucy5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGFjdGlvbi50YXJnZXQ7XG4gICAgICBjb25zdCB2YWx1ZSA9IGFjdGlvbi52YWx1ZTtcbiAgICAgIHRhcmdldC5zZXRWYWx1ZUF0VGltZSh2YWx1ZSwgdGltZSk7IC8vIEZJWE1FIFBFUkYgaG9wZWZ1bGx5IGJpZyBvYmogbm90IHBhc3NlZCBieSB2YWx1ZVxuICAgICAgLy8gY29uc3QgdGFyZ2V0ID0gc3ludGgua2V5c1t0YXJnZXRdOyBsb29rdXAgdmlhIHN5bnRoXG4gICAgfSk7XG4gIH1cbiAgbmV3QWN0aW9uKHRhcmdldCwgdmFsdWUpIHtcbiAgICBjb25zdCBhY3Rpb24gPSBuZXcgU3RlcEFjdGlvbih0YXJnZXQsIHZhbHVlKTtcbiAgICB0aGlzLmFkZEFjdGlvbihhY3Rpb24pO1xuICB9XG4gIGFkZEFjdGlvbihhY3Rpb24pIHtcbiAgICAvLyBUT0RPIENvdWxkIGNoZWNrIGZvciBkdXBlcyBidXQgbGFzdCB2YWwgPSB0aGUgZmluYWwgc2V0IGR1cmluZyBzY2hlZHVsaW5nXG4gICAgdGhpcy5hY3Rpb25zLnB1c2goYWN0aW9uKTtcbiAgfVxuICByZW1vdmVBY3Rpb25zKCkge1xuICAgIC8vIFdvdWxkIGxpa2UgdG8gZG8gc2luZ2xlIHJlbW92YWwgYnV0IHdvdWxkIG5lZWQgd2F5IHRvIHRyYWNrIGFjdGlvbnNcbiAgICAvLyBOQkQgZm9yIGtleSBvbiAvIG9mZiB0aG91Z2gsIHNpbmNlIGtleSBjb3VsZCBiZSBpZCB0byByZXBsYWNlXG4gICAgdGhpcy5hY3Rpb25zID0gW107XG4gIH1cbn1cblxuIiwiaW1wb3J0IHsgQ29udmVydCB9IGZyb20gJy4vY29udmVydC5lczYnO1xuZXhwb3J0IGNsYXNzIFN5bnRoIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgb3V0cHV0KSB7XG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMub3V0cHV0ID0gb3V0cHV0O1xuICAgIHRoaXMub3NjaWxsYXRvcnMgPSB7fTtcbiAgICB0aGlzLmdhaW5zID0ge307XG4gIH1cbiAgY3JlYXRlTm90ZShpbnB1dE5vdGUpIHtcbiAgICBsZXQgZnJlcTtcbiAgICBpZiAodHlwZW9mIGlucHV0Tm90ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGZyZXEgPSBpbnB1dE5vdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyZXEgPSBDb252ZXJ0LmZyZXFGcm9tTm90ZShpbnB1dE5vdGUpO1xuICAgIH1cbiAgICBjb25zdCBvc2MgPSB0aGlzLmNyZWF0ZU9zY2lsbGF0b3IoZnJlcSk7XG4gICAgY29uc3QgZ2FpbiA9IHRoaXMuY3JlYXRlR2FpbigpO1xuICAgIG9zYy5jb25uZWN0KGdhaW4pO1xuICAgIG9zYy5zdGFydCgpO1xuICAgIHRoaXMub3NjaWxsYXRvcnNbaW5wdXROb3RlXSA9IG9zYztcbiAgICB0aGlzLmdhaW5zW2lucHV0Tm90ZV0gPSBnYWluO1xuICB9XG5cbiAgY3JlYXRlR2FpbigpIHtcbiAgICBjb25zdCBnID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGcuY29ubmVjdCh0aGlzLm91dHB1dCk7XG4gICAgZy5nYWluLnZhbHVlID0gMDtcbiAgICByZXR1cm4gZztcbiAgfVxuXG4gIGNyZWF0ZU9zY2lsbGF0b3IoIGZyZXEsIHR5cGUgPSAnc2luZScpIHtcbiAgICBjb25zdCBvID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgIG8udHlwZSA9IHR5cGU7XG4gICAgby5mcmVxdWVuY3kudmFsdWUgPSBmcmVxO1xuICAgIHJldHVybiBvO1xuICB9XG4gIHRvZ2dsZShrZXksIG9uKSB7XG4gICAgaWYgKG9uKSB7XG4gICAgICB0aGlzLm9uKGtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2ZmKGtleSk7XG4gICAgfVxuICB9XG4gIG9uKGtleSwgdm9sdW1lID0gMC41KSB7XG4gICAgdGhpcy5nYWluc1trZXldLmdhaW4udmFsdWUgPSB2b2x1bWU7XG4gIH1cbiAgb2ZmKGtleSkge1xuICAgIHRoaXMuZ2FpbnNba2V5XS5nYWluLnZhbHVlID0gMDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29udmVydCB9IGZyb20gJy4vY29udmVydC5lczYnO1xuXG5leHBvcnQgY2xhc3MgVUkge1xuICBzdGF0aWMgdG9nZ2xlKG5vdGUpIHtcbiAgICBjb25zdCBrZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChub3RlKTtcbiAgICBjb25zdCBvbiA9IGtleS5jbGFzc0xpc3QudG9nZ2xlKCdvbicpO1xuICAgIHJldHVybiBvbjtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlS2V5KG5vdGUsIHRvZ2dsZUFjdGlvbikge1xuICAgIGNvbnN0IGtleSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGtleS5pZCA9IG5vdGU7XG4gICAga2V5LmNsYXNzTGlzdC5hZGQoJ2tleScpO1xuICAgIGxldCB7bGFiZWwsIGZyZXEgfSA9IGdldExhYmVsQW5kRnJlcShub3RlKTtcbiAgICBrZXkuaW5uZXJIVE1MID0gbGFiZWxcbiAgICBrZXkuZGF0YXNldC5mcmVxdWVuY3kgPSBDb252ZXJ0LnJvdW5kKGZyZXEsIDMpO1xuICAgIGtleS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUFjdGlvbik7XG4gICAgcmV0dXJuIGtleTtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlU2luZ2xldChub3RlLCB0b2dnbGVBY3Rpb24sIGtleWJvYXJkKSB7XG4gICAgY29uc3Qgc2luZ2xldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNpbmdsZXQuaWQgPSBub3RlO1xuICAgIHNpbmdsZXQuY2xhc3NMaXN0LmFkZCgna2V5Jyk7XG4gICAgc2luZ2xldC5jbGFzc0xpc3QuYWRkKCdzaW5nbGV0Jyk7XG4gICAgbGV0IHsgbGFiZWwsIGZyZXEgfSA9IGdldExhYmVsQW5kRnJlcShub3RlKTtcbiAgICBzaW5nbGV0LmlubmVySFRNTCA9IGtleWJvYXJkIHx8IGxhYmVsXG4gICAgc2luZ2xldC5kYXRhc2V0LmZyZXF1ZW5jeSA9IENvbnZlcnQucm91bmQoZnJlcSwgMyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0b2dnbGVBY3Rpb24pO1xuICAgIHJldHVybiBzaW5nbGV0O1xuICB9XG5cbiAgc3RhdGljIG1ha2VUcmlwbGV0KHRyaXBsZXQsIHRhcmdldCkge1xuICAgIGNvbnN0IHRyaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0cmlwLmNsYXNzTGlzdC5hZGQoJ3RyaXBsZXQnKTtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0cmlwbGV0LmZvckVhY2gocyA9PiB0cmlwLmFwcGVuZENoaWxkKHMpKTtcbiAgICAgIHRhcmdldC5hcHBlbmRDaGlsZCh0cmlwKTtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH1cbiAgICByZXR1cm4gdHJpcDtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlU3RlcChudW0pIHtcbiAgICBpZiAoIW51bSkgdGhyb3cgRXJyb3IgKCdubyBzdGVwIG51bWJlcicpO1xuICAgIGNvbnN0IHN0ZXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGVwLmlkID0gYHN0ZXAtJHtudW19YDtcbiAgICBzdGVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VxdWVuY2UpO1xuICAgIHJldHVybiBzdGVwO1xuICB9XG5cbiAgc3RhdGljIG1ha2VDaG9pY2UoYWN0aW9uLCBsYWJlbCkge1xuICAgIGlmICghYWN0aW9uKSB0aHJvdyBFcnJvciAoJ25vIGNob2ljZSBhY3Rpb24nKTtcbiAgICBpZiAoIWxhYmVsKSB0aHJvdyBFcnJvciAoJ25vIGNob2ljZSBsYWJlbCcpO1xuICAgIGNvbnN0IGNob2ljZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNob2ljZS5pZCA9ICdjaG9pY2UtJHtsYWJlbH0nO1xuICAgIGNob2ljZS5jbGFzc0xpc3QuYWRkKCdrZXknKTtcbiAgICBjaG9pY2UuY2xhc3NMaXN0LmFkZCgnY2hvaWNlJyk7XG4gICAgY2hvaWNlLmlubmVySFRNTCA9IGxhYmVsO1xuICAgIGNob2ljZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjdGlvbik7XG4gICAgcmV0dXJuIGNob2ljZTtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlU3RvcChhY3Rpb24pIHtcbiAgICBpZiAoIWFjdGlvbikgdGhyb3cgRXJyb3IgKCdubyBzdG9wIGFjdGlvbicpO1xuICAgIGNvbnN0IHN0b3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdG9wLmlkID0gJ3N0b3AnXG4gICAgc3RvcC5jbGFzc0xpc3QuYWRkKCdzdG9wJyk7XG4gICAgc3RvcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjdGlvbik7XG4gICAgcmV0dXJuIHN0b3A7XG4gIH1cblxuICBzdGF0aWMgbWFrZVBsYXkoYWN0aW9uKSB7XG4gICAgaWYgKCFhY3Rpb24pIHRocm93IEVycm9yICgnbm8gcGxheSBhY3Rpb24nKTtcbiAgICBjb25zdCBwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheS5pZCA9ICdwbGF5J1xuICAgIHBsYXkuY2xhc3NMaXN0LmFkZCgncGxheScpO1xuICAgIHBsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhY3Rpb24pO1xuICAgIHJldHVybiBwbGF5O1xuICB9XG5cbiAgc3RhdGljIGF0dGFjaE1lc3NhZ2UyVSh0YXJnZXROb2RlKSB7XG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB0ZXh0LmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UtMi11Jyk7XG4gICAgdGV4dC5pbm5lckhUTUw9ICdwcmVzcyBzcGFjZSBrZXkgdG8gc3RvcCBzb3VuZHMnO1xuICAgIHRhcmdldE5vZGUuYXBwZW5kQ2hpbGQodGV4dCk7XG4gIH1cbn1cblxuXG5cbmZ1bmN0aW9uIGdldExhYmVsQW5kRnJlcShub3RlKSB7XG4gIGxldCBsYWJlbDtcbiAgbGV0IGZyZXE7XG4gIGlmICh0eXBlb2Ygbm90ZSA9PT0gJ3N0cmluZycpIHtcbiAgICBmcmVxID0gQ29udmVydC5mcmVxRnJvbU5vdGUobm90ZSk7XG4gICAgbGFiZWwgPSBub3RlLnJlcGxhY2UoJ2InLCAn4pmtJyk7XG4gICAgaWYgKG5vdGUubWF0Y2goJ2InKSkga2V5LmNsYXNzTGlzdC5hZGQoJ2Vib255Jyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG5vdGUgPT09ICdudW1iZXInKSB7XG4gICAgZnJlcSA9IG5vdGU7XG4gICAgbGFiZWwgPSBTdHJpbmcoQ29udmVydC5yb3VuZChmcmVxLCAxKSk7XG4gIH1cbiAgcmV0dXJuIHsgbGFiZWwsIGZyZXEgfTtcbn1cbiJdfQ==
