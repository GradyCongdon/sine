(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _synth = require('./synth.es6');

var _ui = require('./ui.es6');

// import { Sequencer } from './sequencer.es6';

var audioContext = new AudioContext();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmVzNiIsInNyYy9jb252ZXJ0LmVzNiIsInNyYy9zeW50aC5lczYiLCJzcmMvdWkuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNLGVBQWUsSUFBSSxZQUFKLEVBQXJCO0FBQ0EsSUFBTSxTQUFTLGFBQWEsV0FBNUI7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQSxJQUFJLFFBQVEsQ0FDVixJQURVLEVBRVYsS0FGVSxFQUdWLElBSFUsRUFJVixJQUpVLEVBS1YsS0FMVSxFQU1WLElBTlUsRUFPVixLQVBVLEVBUVYsSUFSVSxFQVNWLElBVFUsRUFVVixLQVZVLEVBV1YsSUFYVSxFQVlWLEtBWlUsRUFhVixJQWJVLENBQVo7O0FBZ0JBLElBQUksUUFBUSxpQkFBVSxZQUFWLEVBQXdCLE1BQXhCLENBQVo7QUFDQSxJQUFNLFVBQVUsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBQWhCOztBQUVBLE1BQU0sT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO0FBQ3RCLFFBQU0sVUFBTixDQUFpQixJQUFqQjtBQUNBLE1BQU0sU0FBUyxTQUFULE1BQVMsR0FBTTtBQUNuQixRQUFNLEtBQUssT0FBRyxNQUFILENBQVUsSUFBVixDQUFYO0FBQ0EsVUFBTSxNQUFOLENBQWEsSUFBYixFQUFtQixFQUFuQjtBQUNELEdBSEQ7QUFJQSxNQUFNLE1BQU0sT0FBRyxPQUFILENBQVcsSUFBWCxFQUFpQixNQUFqQixDQUFaO0FBQ0EsVUFBUSxXQUFSLENBQW9CLEdBQXBCO0FBQ0QsQ0FSRDs7QUFVQSxJQUFJLFFBQVEsaUJBQVosRUFBK0I7QUFDN0IsVUFBUSxHQUFSLENBQVksc0JBQVo7QUFDRCxDQUZELE1BRU87QUFDTCxVQUFRLFNBQVIsR0FBb0IscUJBQXBCO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7QUM3Q0QsSUFBTSxRQUFRLENBQUUsR0FBRixF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QUFPLEdBQVA7QUFDRDs7OzZCQUVlLEcsRUFBSztBQUNuQixVQUFJLENBQUMsR0FBTCxFQUFVLE1BQU0sTUFBTyxnQkFBUCxDQUFOO0FBQ1YsVUFBTSxPQUFPLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFiO0FBQ0EsV0FBSyxFQUFMLGFBQWtCLEdBQWxCO0FBQ0EsV0FBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixRQUEvQjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7MkJBRWEsSSxFQUFNO0FBQ2xCLFVBQU0sTUFBTSxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsQ0FBWjtBQUNBLFVBQU0sS0FBSyxJQUFJLFNBQUosQ0FBYyxNQUFkLENBQXFCLElBQXJCLENBQVg7QUFDQSxhQUFPLEVBQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBTeW50aCB9IGZyb20gJy4vc3ludGguZXM2JztcbmltcG9ydCB7IFVJIH0gZnJvbSAnLi91aS5lczYnO1xuLy8gaW1wb3J0IHsgU2VxdWVuY2VyIH0gZnJvbSAnLi9zZXF1ZW5jZXIuZXM2JztcblxuY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuY29uc3Qgb3V0cHV0ID0gYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uO1xuXG4vLyBjb25zdCBzZXF1ZW5jZXIgPSBuZXcgU2VxdWVuY2VyKGF1ZGlvQ29udGV4dCwgMTIwKTtcbi8vIGNvbnN0IGdhaW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuLy8gc2VxdWVuY2VyLm5ld0FjdGlvbigwLCBnYWluLCAxKTtcblxuXG5sZXQgbm90ZXMgPSBbXG4gICdBNCcsXG4gICdCYjQnLFxuICAnQjQnLFxuICAnQzQnLFxuICAnRGI0JyxcbiAgJ0Q0JyxcbiAgJ0ViNCcsXG4gICdFNCcsXG4gICdGNCcsXG4gICdHYjQnLFxuICAnRzQnLFxuICAnQWI1JyxcbiAgJ0E1Jyxcbl07XG5cbmxldCBzeW50aCA9IG5ldyBTeW50aChhdWRpb0NvbnRleHQsIG91dHB1dCk7XG5jb25zdCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKTtcblxubm90ZXMuZm9yRWFjaCgobm90ZSkgPT4ge1xuICBzeW50aC5jcmVhdGVOb3RlKG5vdGUpO1xuICBjb25zdCBhY3Rpb24gPSAoKSA9PiB7XG4gICAgY29uc3Qgb24gPSBVSS50b2dnbGUobm90ZSk7XG4gICAgc3ludGgudG9nZ2xlKG5vdGUsIG9uKTtcbiAgfTtcbiAgY29uc3Qga2V5ID0gVUkubWFrZUtleShub3RlLCBhY3Rpb24pO1xuICBjb250ZW50LmFwcGVuZENoaWxkKGtleSk7XG59KTtcblxuaWYgKGNvbnRlbnQuY2hpbGRFbGVtZW50Q291bnQpIHtcbiAgY29uc29sZS5sb2coJ3N1cmZpbiBvbiBzaW5lIHdhdmVzJyk7XG59IGVsc2Uge1xuICBjb250ZW50LmlubmVySFRNTCA9ICdicm9rZSBpdCDCr1xcXFxfKOODhClfL8KvJztcbn1cblxuIiwiY29uc3Qgbm90ZXMgPSBbICdBJywgJ0JiJywgJ0InLCAnQycsICdEYicsICdEJywgJ0ViJywgJ0UnLCAnRicsICdHYicsICdHJ107XG5cbmV4cG9ydCBjbGFzcyBDb252ZXJ0IHtcblxuICBzdGF0aWMgZnJlcUZyb21TdGVwKHN0ZXBzLCBmaXhlZCA9IDQ0MCkge1xuICAgIGNvbnN0IGEgPSAyICoqICgxLzEyKTtcbiAgICByZXR1cm4gZml4ZWQgKiBNYXRoLnBvdyhhLCBzdGVwcyk7XG4gIH1cblxuICBzdGF0aWMgbm90ZUZyb21TdGVwKHN0ZXApIHtcbiAgICBjb25zdCBub3RlID0gc3RlcCAlIG5vdGVzLmxlbmd0aDtcbiAgICByZXR1cm4gbm90ZXNbbm90ZV07XG4gIH1cblxuICBzdGF0aWMgc3RyaW5nVG9Ob3RlKHN0cikge1xuICAgIGNvbnN0IG9jdGF2ZUluZGV4ID0gc3RyLm1hdGNoKC9bMC05XS8pLmluZGV4O1xuICAgIGNvbnN0IG9jdGF2ZSA9IHN0ci5zbGljZShvY3RhdmVJbmRleCk7XG4gICAgY29uc3Qgbm90ZSA9IHN0ci5zbGljZSgwLCBvY3RhdmVJbmRleCk7XG4gICAgcmV0dXJuIHsgbm90ZSwgb2N0YXZlIH07XG4gIH1cblxuICBzdGF0aWMgZnJlcUZyb21Ob3RlKGlucHV0Tm90ZSkge1xuICAgIGlmICh0eXBlb2YgaW5wdXROb3RlICE9PSAnc3RyaW5nJykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgeyBub3RlLCBvY3RhdmUgfSA9ICBDb252ZXJ0LnN0cmluZ1RvTm90ZShpbnB1dE5vdGUpO1xuICAgIGNvbnN0IHNlbWkgPSBub3Rlcy5pbmRleE9mKG5vdGUpO1xuICAgIGxldCBmcmVxID0gQ29udmVydC5mcmVxRnJvbVN0ZXAoc2VtaSk7XG4gICAgbGV0IGRpZmYgPSBvY3RhdmUgLSA0O1xuICAgIGxldCBkaXIgPSBNYXRoLnNpZ24oZGlmZik7XG4gICAgd2hpbGUgKGRpZmYpIHtcbiAgICAgIGlmIChkaXIgPT09IDEpIHtcbiAgICAgICAgZnJlcSAqPSAyO1xuICAgICAgICBkaWZmLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcmVxIC89IDI7XG4gICAgICAgIGRpZmYrKztcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBmcmVxO1xuICB9XG5cbiAgc3RhdGljIHJvdW5kKG51bWJlciwgcHJlY2lzaW9uKSB7XG4gICAgICB2YXIgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG4gICAgICB2YXIgdGVtcE51bWJlciA9IG51bWJlciAqIGZhY3RvcjtcbiAgICAgIHZhciByb3VuZGVkVGVtcE51bWJlciA9IE1hdGgucm91bmQodGVtcE51bWJlcik7XG4gICAgICByZXR1cm4gcm91bmRlZFRlbXBOdW1iZXIgLyBmYWN0b3I7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBDb252ZXJ0IH0gZnJvbSAnLi9jb252ZXJ0LmVzNic7XG5leHBvcnQgY2xhc3MgU3ludGgge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvdXRwdXQpIHtcbiAgICB0aGlzLmF1ZGlvQ29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5vdXRwdXQgPSBvdXRwdXQ7XG4gICAgdGhpcy5vc2NpbGxhdG9ycyA9IHt9O1xuICAgIHRoaXMuZ2FpbnMgPSB7fTtcbiAgfVxuICBjcmVhdGVOb3RlKGlucHV0Tm90ZSkge1xuICAgIGNvbnN0IG5vdGUgPSBpbnB1dE5vdGU7XG4gICAgY29uc3QgZnJlcSA9IENvbnZlcnQuZnJlcUZyb21Ob3RlKG5vdGUpO1xuICAgIGNvbnN0IG9zYyA9IHRoaXMuY3JlYXRlT3NjaWxsYXRvcihmcmVxKTtcbiAgICBjb25zdCBnYWluID0gdGhpcy5jcmVhdGVHYWluKCk7XG4gICAgb3NjLmNvbm5lY3QoZ2Fpbik7XG4gICAgb3NjLnN0YXJ0KCk7XG4gICAgdGhpcy5vc2NpbGxhdG9yc1tpbnB1dE5vdGVdID0gb3NjO1xuICAgIHRoaXMuZ2FpbnNbaW5wdXROb3RlXSA9IGdhaW47XG4gIH1cblxuICBjcmVhdGVHYWluKCkge1xuICAgIGNvbnN0IGcgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgZy5jb25uZWN0KHRoaXMub3V0cHV0KTtcbiAgICBnLmdhaW4udmFsdWUgPSAwO1xuICAgIHJldHVybiBnO1xuICB9XG5cbiAgY3JlYXRlT3NjaWxsYXRvciggZnJlcSwgdHlwZSA9ICdzaW5lJykge1xuICAgICAgY29uc3QgbyA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICAgIG8udHlwZSA9IHR5cGU7XG4gICAgICBvLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXE7XG4gICAgICByZXR1cm4gbztcbiAgfVxuICB0b2dnbGUoa2V5LCBvbikge1xuICAgIGlmIChvbikge1xuICAgICAgdGhpcy5vbihrZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9mZihrZXkpO1xuICAgIH1cbiAgfVxuICBvbihrZXksIHZvbHVtZSA9IDAuNSkge1xuICAgIHRoaXMuZ2FpbnNba2V5XS5nYWluLnZhbHVlID0gdm9sdW1lO1xuICB9XG4gIG9mZihrZXkpIHtcbiAgICB0aGlzLmdhaW5zW2tleV0uZ2Fpbi52YWx1ZSA9IDA7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbnZlcnQgfSBmcm9tICcuL2NvbnZlcnQuZXM2JztcblxuZXhwb3J0IGNsYXNzIFVJIHtcblxuICBzdGF0aWMgbWFrZUtleShub3RlLCB0b2dnbGVBY3Rpb24pIHtcbiAgICBjb25zdCBrZXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBrZXkuaWQgPSBub3RlO1xuICAgIGtleS5pbm5lckhUTUwgPSBub3RlLnJlcGxhY2UoJ2InLCAn4pmtJyk7XG4gICAga2V5LmNsYXNzTGlzdC5hZGQoJ2tleScpO1xuXG4gICAgaWYgKG5vdGUubWF0Y2goJ2InKSkga2V5LmNsYXNzTGlzdC5hZGQoJ2Vib255Jyk7XG4gICAgY29uc3QgZnJlcSA9IENvbnZlcnQuZnJlcUZyb21Ob3RlKG5vdGUpO1xuICAgIGtleS5kYXRhc2V0LmZyZXF1ZW5jeSA9IENvbnZlcnQucm91bmQoZnJlcSwgMyk7XG5cbiAgICBrZXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVBY3Rpb24pO1xuICAgIHJldHVybiBrZXk7XG4gIH1cblxuICBzdGF0aWMgbWFrZVN0ZXAobnVtKSB7XG4gICAgaWYgKCFudW0pIHRocm93IEVycm9yICgnbm8gc3RlcCBudW1iZXInKTtcbiAgICBjb25zdCBzdGVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3RlcC5pZCA9IGBzdGVwLSR7bnVtfWA7XG4gICAgc3RlcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlcXVlbmNlKTtcbiAgICByZXR1cm4gc3RlcDtcbiAgfVxuXG4gIHN0YXRpYyB0b2dnbGUobm90ZSkge1xuICAgIGNvbnN0IGtleSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5vdGUpO1xuICAgIGNvbnN0IG9uID0ga2V5LmNsYXNzTGlzdC50b2dnbGUoJ29uJyk7XG4gICAgcmV0dXJuIG9uO1xuICB9XG59XG5cbiJdfQ==
