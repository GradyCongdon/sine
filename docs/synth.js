'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Synth = exports.Synth = function () {
  function Synth() {
    _classCallCheck(this, Synth);
  }

  _createClass(Synth, null, [{
    key: 'setupOscillator',
    value: function setupOscillator(inputNote) {
      var note = inputNote;
      var freq = Convert.freqFromNote(note);
      var osc = createOscillator(freq);
      var gain = createGain();
      osc.connect(gain);
      osc.start();
      return { note: note, osc: osc, gain: gain };
    }
  }, {
    key: 'createGain',
    value: function createGain() {
      var g = con.createGain();
      g.connect(out);
      g.gain.value = 0;
      return g;
    }
  }, {
    key: 'createOscillator',
    value: function createOscillator(freq) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sine';

      var o = con.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      return o;
    }
  }]);

  return Synth;
}();