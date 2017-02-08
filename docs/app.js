'use strict';

var _sequencer = require('./sequencer.js');

var _synth = require('./synth.js');

var _convert = require('./convert.js');

var _ui = require('./ui.js');

var con = new AudioContext();
var seq = new _sequencer.Sequencer(con, 120);
var gain = con.creatGain();
seq.addAction(0, gain, 1);

var keys = ['A4', 'Bb4', 'B4', 'C4', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5'];

var synth = [];
var content = document.getElementById('content');

keys.forEach(function (key) {
  var osc = _synth.Synth.setupOscillator(key);
  synth.push(osc);
  content.appendChild(_ui.UI.makeKey(key));
});

console.log('surfin on sine waves');