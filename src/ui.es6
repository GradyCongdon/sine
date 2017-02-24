import { Convert } from './convert.es6';

export class UI {

  static makeKey(note, toggleAction) {
    const key = document.createElement('div');
    key.id = note;
    key.innerHTML = note;
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

  static toggle(note) {
    const key = document.getElementById(note);
    const on = key.classList.toggle('on');
    return on;
  }
}

