'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.toggle = toggle;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI = exports.UI = function () {
  function UI() {
    _classCallCheck(this, UI);
  }

  _createClass(UI, null, [{
    key: 'makeKey',
    value: function makeKey(key) {
      var ivory = document.createElement('div');
      ivory.id = key;
      ivory.innerHTML = key;
      ivory.dataset.frequency = round(t(key), 3);
      ivory.classList.add('key');
      if (key.match('b')) ivory.classList.add('ebony');
      ivory.addEventListener('click', toggle);
      return ivory;
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
  }]);

  return UI;
}();

function toggle(event) {
  var key = event.target;
  var on = key.classList.toggle('on');
  // Lookup components on target
  // Run on funcs for each
  if (on) {
    // FIXME synth global
    synth[key.id].gain.gain.value = 0.5;
  } else {
    synth[key.id].gain.gain.value = 0;
  }
}