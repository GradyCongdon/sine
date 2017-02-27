import { Convert } from './convert.es6';

export class UI {

  static makeKey(note, toggleAction) {
    const key = document.createElement('div');
    key.id = note;
    key.classList.add('key');
    let label;
    let freq; 
    if (typeof note === 'string') {
      freq = Convert.freqFromNote(note);
      label = note.replace('b', '♭');
      if (note.match('b')) key.classList.add('ebony');
    } else if (typeof note === 'number') {
      freq = note;
      label = String(Convert.round(freq, 1));
    }
    key.innerHTML = label
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

  static makeChoice(action, label) {
    if (!action) throw Error ('no choice action');
    if (!label) throw Error ('no choice label');
    const choice = document.createElement('div');
    choice.id = 'choice-${label}';
    choice.classList.add('key');
    choice.classList.add('choice');
    choice.innerHTML = label;
    choice.addEventListener('click', action);
    return choice;
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

