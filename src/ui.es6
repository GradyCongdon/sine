import { Convert } from './convert.es6';

export class UI {

  static makeKey(note, toggleAction) {
    const key = document.createElement('div');
    key.id = note;
    key.innerHTML = note.replace('b', '♭');
    key.classList.add('key');

    if (note.match('b')) key.classList.add('ebony');
    const freq = Convert.freqFromNote(note);
    key.dataset.frequency = Convert.round(freq, 3);

    key.addEventListener('click', toggleAction);
    return key;
  }

  static makeStep(num) {
    if (!num) throw Error ('no step number');
    const step = document.createElement('div');
    step.id = `step-${num}`;
    step.addEventListener('click', sequence);
    return step;
  }

  static makeStop(action) {
    if (!action) throw Error ('no stop action');
    const stop = document.createElement('div');
    stop.id = 'stop'
    stop.classList.add('stop');
    stop.addEventListener('click', action);
    return stop;
  }

  static makePlay(action) {
    if (!action) throw Error ('no play action');
    const play = document.createElement('div');
    play.id = 'play'
    play.classList.add('play');
    play.addEventListener('click', action);
    return play;
  }

  static toggle(note) {
    const key = document.getElementById(note);
    const on = key.classList.toggle('on');
    return on;
  }
}

