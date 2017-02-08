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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlVJLmVzNiJdLCJuYW1lcyI6WyJ0b2dnbGUiLCJVSSIsImtleSIsIml2b3J5IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJpbm5lckhUTUwiLCJkYXRhc2V0IiwiZnJlcXVlbmN5Iiwicm91bmQiLCJ0IiwiY2xhc3NMaXN0IiwiYWRkIiwibWF0Y2giLCJhZGRFdmVudExpc3RlbmVyIiwibnVtIiwiRXJyb3IiLCJzdGVwIiwic2VxdWVuY2UiLCJldmVudCIsInRhcmdldCIsIm9uIiwic3ludGgiLCJnYWluIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBc0JnQkEsTSxHQUFBQSxNOzs7O0lBdEJIQyxFLFdBQUFBLEU7Ozs7Ozs7NEJBRUlDLEcsRUFBSztBQUNsQixVQUFNQyxRQUFRQyxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWQ7QUFDQUYsWUFBTUcsRUFBTixHQUFXSixHQUFYO0FBQ0FDLFlBQU1JLFNBQU4sR0FBa0JMLEdBQWxCO0FBQ0FDLFlBQU1LLE9BQU4sQ0FBY0MsU0FBZCxHQUEwQkMsTUFBTUMsRUFBRVQsR0FBRixDQUFOLEVBQWMsQ0FBZCxDQUExQjtBQUNBQyxZQUFNUyxTQUFOLENBQWdCQyxHQUFoQixDQUFvQixLQUFwQjtBQUNBLFVBQUlYLElBQUlZLEtBQUosQ0FBVSxHQUFWLENBQUosRUFBb0JYLE1BQU1TLFNBQU4sQ0FBZ0JDLEdBQWhCLENBQW9CLE9BQXBCO0FBQ3BCVixZQUFNWSxnQkFBTixDQUF1QixPQUF2QixFQUFnQ2YsTUFBaEM7QUFDQSxhQUFPRyxLQUFQO0FBQ0Q7Ozs2QkFFZWEsRyxFQUFLO0FBQ25CLFVBQUksQ0FBQ0EsR0FBTCxFQUFVLE1BQU1DLE1BQU8sZ0JBQVAsQ0FBTjtBQUNWLFVBQU1DLE9BQU9kLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBYjtBQUNBYSxXQUFLWixFQUFMLGFBQWtCVSxHQUFsQjtBQUNBRSxXQUFLSCxnQkFBTCxDQUFzQixPQUF0QixFQUErQkksUUFBL0I7QUFDQSxhQUFPRCxJQUFQO0FBQ0Q7Ozs7OztBQUdJLFNBQVNsQixNQUFULENBQWdCb0IsS0FBaEIsRUFBdUI7QUFDNUIsTUFBTWxCLE1BQU1rQixNQUFNQyxNQUFsQjtBQUNBLE1BQU1DLEtBQUtwQixJQUFJVSxTQUFKLENBQWNaLE1BQWQsQ0FBcUIsSUFBckIsQ0FBWDtBQUNBO0FBQ0E7QUFDQSxNQUFJc0IsRUFBSixFQUFRO0FBQ047QUFDQUMsVUFBTXJCLElBQUlJLEVBQVYsRUFBY2tCLElBQWQsQ0FBbUJBLElBQW5CLENBQXdCQyxLQUF4QixHQUFnQyxHQUFoQztBQUNELEdBSEQsTUFHTztBQUNMRixVQUFNckIsSUFBSUksRUFBVixFQUFja0IsSUFBZCxDQUFtQkEsSUFBbkIsQ0FBd0JDLEtBQXhCLEdBQWdDLENBQWhDO0FBQ0Q7QUFDRiIsImZpbGUiOiJVSS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBVSSB7XG5cbiAgc3RhdGljIG1ha2VLZXkoa2V5KSB7XG4gICAgY29uc3QgaXZvcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpdm9yeS5pZCA9IGtleTtcbiAgICBpdm9yeS5pbm5lckhUTUwgPSBrZXk7XG4gICAgaXZvcnkuZGF0YXNldC5mcmVxdWVuY3kgPSByb3VuZCh0KGtleSksIDMpO1xuICAgIGl2b3J5LmNsYXNzTGlzdC5hZGQoJ2tleScpO1xuICAgIGlmIChrZXkubWF0Y2goJ2InKSkgaXZvcnkuY2xhc3NMaXN0LmFkZCgnZWJvbnknKTtcbiAgICBpdm9yeS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZSk7XG4gICAgcmV0dXJuIGl2b3J5O1xuICB9XG5cbiAgc3RhdGljIG1ha2VTdGVwKG51bSkge1xuICAgIGlmICghbnVtKSB0aHJvdyBFcnJvciAoJ25vIHN0ZXAgbnVtYmVyJyk7XG4gICAgY29uc3Qgc3RlcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0ZXAuaWQgPSBgc3RlcC0ke251bX1gO1xuICAgIHN0ZXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZXF1ZW5jZSk7XG4gICAgcmV0dXJuIHN0ZXA7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZShldmVudCkge1xuICBjb25zdCBrZXkgPSBldmVudC50YXJnZXQ7XG4gIGNvbnN0IG9uID0ga2V5LmNsYXNzTGlzdC50b2dnbGUoJ29uJyk7XG4gIC8vIExvb2t1cCBjb21wb25lbnRzIG9uIHRhcmdldFxuICAvLyBSdW4gb24gZnVuY3MgZm9yIGVhY2hcbiAgaWYgKG9uKSB7IFxuICAgIC8vIEZJWE1FIHN5bnRoIGdsb2JhbFxuICAgIHN5bnRoW2tleS5pZF0uZ2Fpbi5nYWluLnZhbHVlID0gMC41O1xuICB9IGVsc2Uge1xuICAgIHN5bnRoW2tleS5pZF0uZ2Fpbi5nYWluLnZhbHVlID0gMDtcbiAgfVxufVxuIl19
