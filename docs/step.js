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