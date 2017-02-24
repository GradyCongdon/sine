(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _synth = require('./synth.es6');

var _ui = require('./ui.es6');

// import { Sequencer } from './sequencer.es6';

var audio = window.AudioContext || window.webkitAudioContext;
var audioContext = new audio();
var output = audioContext.destination;

// const sequencer = new Sequencer(audioContext, 120);
// const gain = audioContext.createGain();
// sequencer.newAction(0, gain, 1);


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

},{"./synth.es6":3,"./ui.es6":4}],2:[function(require,module,exports){
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

},{"./convert.es6":2}],4:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmVzNiIsInNyYy9jb252ZXJ0LmVzNiIsInNyYy9zeW50aC5lczYiLCJzcmMvdWkuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFJLFFBQVMsT0FBTyxZQUFQLElBQXVCLE9BQU8sa0JBQTNDO0FBQ0EsSUFBTSxlQUFlLElBQUksS0FBSixFQUFyQjtBQUNBLElBQU0sU0FBUyxhQUFhLFdBQTVCOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0EsSUFBSSxRQUFRLENBQ1YsSUFEVSxFQUVWLEtBRlUsRUFHVixJQUhVLEVBSVYsSUFKVSxFQUtWLEtBTFUsRUFNVixJQU5VLEVBT1YsS0FQVSxFQVFWLElBUlUsRUFTVixJQVRVLEVBVVYsS0FWVSxFQVdWLElBWFUsRUFZVixLQVpVLEVBYVYsSUFiVSxDQUFaOztBQWdCQSxJQUFJLFFBQVEsaUJBQVUsWUFBVixFQUF3QixNQUF4QixDQUFaO0FBQ0EsSUFBTSxVQUFVLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQUFoQjs7QUFFQSxNQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBVTtBQUN0QixRQUFNLFVBQU4sQ0FBaUIsSUFBakI7QUFDQSxNQUFNLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDbkIsUUFBTSxLQUFLLE9BQUcsTUFBSCxDQUFVLElBQVYsQ0FBWDtBQUNBLFVBQU0sTUFBTixDQUFhLElBQWIsRUFBbUIsRUFBbkI7QUFDRCxHQUhEO0FBSUEsTUFBTSxNQUFNLE9BQUcsT0FBSCxDQUFXLElBQVgsRUFBaUIsTUFBakIsQ0FBWjtBQUNBLFVBQVEsV0FBUixDQUFvQixHQUFwQjtBQUNELENBUkQ7O0FBVUEsSUFBSSxRQUFRLGlCQUFaLEVBQStCO0FBQzdCLFVBQVEsR0FBUixDQUFZLHNCQUFaO0FBQ0QsQ0FGRCxNQUVPO0FBQ0wsVUFBUSxTQUFSLEdBQW9CLHFCQUFwQjtB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QSxVQUFJLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLFlBQTlCO0FBQ0EsYUFBTyxHQUFQO0FBQ0Q7Ozs2QkFFZSxHLEVBQUs7QUFDbkIsVUFBSSxDQUFDLEdBQUwsRUFBVSxNQUFNLE1BQU8sZ0JBQVAsQ0FBTjtBQUNWLFVBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBYjtBQUNBLFdBQUssRUFBTCxhQUFrQixHQUFsQjtBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsUUFBL0I7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzJCQUVhLEksRUFBTTtBQUNsQixVQUFNLE1BQU0sU0FBUyxjQUFULENBQXdCLElBQXhCLENBQVo7QUFDQSxVQUFNLEtBQUssSUFBSSxTQUFKLENBQWMsTUFBZCxDQUFxQixJQUFyQixDQUFYO0FBQ0EsYUFBTyxFQUFQO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgU3ludGggfSBmcm9tICcuL3N5bnRoLmVzNic7XG5pbXBvcnQgeyBVSSB9IGZyb20gJy4vdWkuZXM2Jztcbi8vIGltcG9ydCB7IFNlcXVlbmNlciB9IGZyb20gJy4vc2VxdWVuY2VyLmVzNic7XG5cbnZhciBhdWRpbyA9ICB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5jb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgYXVkaW8oKTtcbmNvbnN0IG91dHB1dCA9IGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbjtcblxuLy8gY29uc3Qgc2VxdWVuY2VyID0gbmV3IFNlcXVlbmNlcihhdWRpb0NvbnRleHQsIDEyMCk7XG4vLyBjb25zdCBnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbi8vIHNlcXVlbmNlci5uZXdBY3Rpb24oMCwgZ2FpbiwgMSk7XG5cblxubGV0IG5vdGVzID0gW1xuICAnQTQnLFxuICAnQmI0JyxcbiAgJ0I0JyxcbiAgJ0M0JyxcbiAgJ0RiNCcsXG4gICdENCcsXG4gICdFYjQnLFxuICAnRTQnLFxuICAnRjQnLFxuICAnR2I0JyxcbiAgJ0c0JyxcbiAgJ0FiNScsXG4gICdBNScsXG5dO1xuXG5sZXQgc3ludGggPSBuZXcgU3ludGgoYXVkaW9Db250ZXh0LCBvdXRwdXQpO1xuY29uc3QgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jyk7XG5cbm5vdGVzLmZvckVhY2goKG5vdGUpID0+IHtcbiAgc3ludGguY3JlYXRlTm90ZShub3RlKTtcbiAgY29uc3QgYWN0aW9uID0gKCkgPT4ge1xuICAgIGNvbnN0IG9uID0gVUkudG9nZ2xlKG5vdGUpO1xuICAgIHN5bnRoLnRvZ2dsZShub3RlLCBvbik7XG4gIH07XG4gIGNvbnN0IGtleSA9IFVJLm1ha2VLZXkobm90ZSwgYWN0aW9uKTtcbiAgY29udGVudC5hcHBlbmRDaGlsZChrZXkpO1xufSk7XG5cbmlmIChjb250ZW50LmNoaWxkRWxlbWVudENvdW50KSB7XG4gIGNvbnNvbGUubG9nKCdzdXJmaW4gb24gc2luZSB3YXZlcycpO1xufSBlbHNlIHtcbiAgY29udGVudC5pbm5lckhUTUwgPSAnYnJva2UgaXQgwq9cXFxcXyjjg4QpXy/Cryc7XG59XG5cbiIsImNvbnN0IG5vdGVzID0gWyAnQScsICdCYicsICdCJywgJ0MnLCAnRGInLCAnRCcsICdFYicsICdFJywgJ0YnLCAnR2InLCAnRyddO1xuXG5leHBvcnQgY2xhc3MgQ29udmVydCB7XG5cbiAgc3RhdGljIGZyZXFGcm9tU3RlcChzdGVwcywgZml4ZWQgPSA0NDApIHtcbiAgICBjb25zdCBhID0gMiAqKiAoMS8xMik7XG4gICAgcmV0dXJuIGZpeGVkICogTWF0aC5wb3coYSwgc3RlcHMpO1xuICB9XG5cbiAgc3RhdGljIG5vdGVGcm9tU3RlcChzdGVwKSB7XG4gICAgY29uc3Qgbm90ZSA9IHN0ZXAgJSBub3Rlcy5sZW5ndGg7XG4gICAgcmV0dXJuIG5vdGVzW25vdGVdO1xuICB9XG5cbiAgc3RhdGljIHN0cmluZ1RvTm90ZShzdHIpIHtcbiAgICBjb25zdCBvY3RhdmVJbmRleCA9IHN0ci5tYXRjaCgvWzAtOV0vKS5pbmRleDtcbiAgICBjb25zdCBvY3RhdmUgPSBzdHIuc2xpY2Uob2N0YXZlSW5kZXgpO1xuICAgIGNvbnN0IG5vdGUgPSBzdHIuc2xpY2UoMCwgb2N0YXZlSW5kZXgpO1xuICAgIHJldHVybiB7IG5vdGUsIG9jdGF2ZSB9O1xuICB9XG5cbiAgc3RhdGljIGZyZXFGcm9tTm90ZShpbnB1dE5vdGUpIHtcbiAgICBpZiAodHlwZW9mIGlucHV0Tm90ZSAhPT0gJ3N0cmluZycpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHsgbm90ZSwgb2N0YXZlIH0gPSAgQ29udmVydC5zdHJpbmdUb05vdGUoaW5wdXROb3RlKTtcbiAgICBjb25zdCBzZW1pID0gbm90ZXMuaW5kZXhPZihub3RlKTtcbiAgICBsZXQgZnJlcSA9IENvbnZlcnQuZnJlcUZyb21TdGVwKHNlbWkpO1xuICAgIGxldCBkaWZmID0gb2N0YXZlIC0gNDtcbiAgICBsZXQgZGlyID0gTWF0aC5zaWduKGRpZmYpO1xuICAgIHdoaWxlIChkaWZmKSB7XG4gICAgICBpZiAoZGlyID09PSAxKSB7XG4gICAgICAgIGZyZXEgKj0gMjtcbiAgICAgICAgZGlmZi0tO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnJlcSAvPSAyO1xuICAgICAgICBkaWZmKys7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gZnJlcTtcbiAgfVxuXG4gIHN0YXRpYyByb3VuZChudW1iZXIsIHByZWNpc2lvbikge1xuICAgICAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuICAgICAgdmFyIHRlbXBOdW1iZXIgPSBudW1iZXIgKiBmYWN0b3I7XG4gICAgICB2YXIgcm91bmRlZFRlbXBOdW1iZXIgPSBNYXRoLnJvdW5kKHRlbXBOdW1iZXIpO1xuICAgICAgcmV0dXJuIHJvdW5kZWRUZW1wTnVtYmVyIC8gZmFjdG9yO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgQ29udmVydCB9IGZyb20gJy4vY29udmVydC5lczYnO1xuZXhwb3J0IGNsYXNzIFN5bnRoIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgb3V0cHV0KSB7XG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMub3V0cHV0ID0gb3V0cHV0O1xuICAgIHRoaXMub3NjaWxsYXRvcnMgPSB7fTtcbiAgICB0aGlzLmdhaW5zID0ge307XG4gIH1cbiAgY3JlYXRlTm90ZShpbnB1dE5vdGUpIHtcbiAgICBjb25zdCBub3RlID0gaW5wdXROb3RlO1xuICAgIGNvbnN0IGZyZXEgPSBDb252ZXJ0LmZyZXFGcm9tTm90ZShub3RlKTtcbiAgICBjb25zdCBvc2MgPSB0aGlzLmNyZWF0ZU9zY2lsbGF0b3IoZnJlcSk7XG4gICAgY29uc3QgZ2FpbiA9IHRoaXMuY3JlYXRlR2FpbigpO1xuICAgIG9zYy5jb25uZWN0KGdhaW4pO1xuICAgIG9zYy5zdGFydCgpO1xuICAgIHRoaXMub3NjaWxsYXRvcnNbaW5wdXROb3RlXSA9IG9zYztcbiAgICB0aGlzLmdhaW5zW2lucHV0Tm90ZV0gPSBnYWluO1xuICB9XG5cbiAgY3JlYXRlR2FpbigpIHtcbiAgICBjb25zdCBnID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGcuY29ubmVjdCh0aGlzLm91dHB1dCk7XG4gICAgZy5nYWluLnZhbHVlID0gMDtcbiAgICByZXR1cm4gZztcbiAgfVxuXG4gIGNyZWF0ZU9zY2lsbGF0b3IoIGZyZXEsIHR5cGUgPSAnc2luZScpIHtcbiAgICAgIGNvbnN0IG8gPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgICBvLnR5cGUgPSB0eXBlO1xuICAgICAgby5mcmVxdWVuY3kudmFsdWUgPSBmcmVxO1xuICAgICAgcmV0dXJuIG87XG4gIH1cbiAgdG9nZ2xlKGtleSwgb24pIHtcbiAgICBpZiAob24pIHtcbiAgICAgIHRoaXMub24oa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vZmYoa2V5KTtcbiAgICB9XG4gIH1cbiAgb24oa2V5LCB2b2x1bWUgPSAwLjUpIHtcbiAgICB0aGlzLmdhaW5zW2tleV0uZ2Fpbi52YWx1ZSA9IHZvbHVtZTtcbiAgfVxuICBvZmYoa2V5KSB7XG4gICAgdGhpcy5nYWluc1trZXldLmdhaW4udmFsdWUgPSAwO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb252ZXJ0IH0gZnJvbSAnLi9jb252ZXJ0LmVzNic7XG5cbmV4cG9ydCBjbGFzcyBVSSB7XG5cbiAgc3RhdGljIG1ha2VLZXkobm90ZSwgdG9nZ2xlQWN0aW9uKSB7XG4gICAgY29uc3Qga2V5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAga2V5LmlkID0gbm90ZTtcbiAgICBrZXkuaW5uZXJIVE1MID0gbm90ZS5yZXBsYWNlKCdiJywgJ+KZrScpO1xuICAgIGtleS5jbGFzc0xpc3QuYWRkKCdrZXknKTtcblxuICAgIGlmIChub3RlLm1hdGNoKCdiJykpIGtleS5jbGFzc0xpc3QuYWRkKCdlYm9ueScpO1xuICAgIGNvbnN0IGZyZXEgPSBDb252ZXJ0LmZyZXFGcm9tTm90ZShub3RlKTtcbiAgICBrZXkuZGF0YXNldC5mcmVxdWVuY3kgPSBDb252ZXJ0LnJvdW5kKGZyZXEsIDMpO1xuXG4gICAga2V5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlQWN0aW9uKTtcbiAgICByZXR1cm4ga2V5O1xuICB9XG5cbiAgc3RhdGljIG1ha2VTdGVwKG51bSkge1xuICAgIGlmICghbnVtKSB0aHJvdyBFcnJvciAoJ25vIHN0ZXAgbnVtYmVyJyk7XG4gICAgY29uc3Qgc3RlcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0ZXAuaWQgPSBgc3RlcC0ke251bX1gO1xuICAgIHN0ZXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZXF1ZW5jZSk7XG4gICAgcmV0dXJuIHN0ZXA7XG4gIH1cblxuICBzdGF0aWMgdG9nZ2xlKG5vdGUpIHtcbiAgICBjb25zdCBrZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChub3RlKTtcbiAgICBjb25zdCBvbiA9IGtleS5jbGFzc0xpc3QudG9nZ2xlKCdvbicpO1xuICAgIHJldHVybiBvbjtcbiAgfVxufVxuXG4iXX0=
