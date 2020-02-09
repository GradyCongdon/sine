import { Convert } from './convert.js';

export class UI {
  static toggle(note) {
    const key = document.getElementById(note);
    const on = key.classList.toggle('on');
    return on;
  }

  static makeKey(note, toggleAction) {
    const key = document.createElement('div');
    key.id = note;
    key.classList.add('key');
    let {label, freq } = getLabelAndFreq(note);
    if (label.match('♭')) key.classList.add('ebony');
    key.innerHTML = label
    key.dataset.frequency = Convert.round(freq, 3);
    key.addEventListener('click', toggleAction);
    return key;
  }

  static makeStep(num, sequence) {
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

  static attachMessage2U(targetNode) {
    const text = document.createElement('p');
    text.classList.add('message-2-u');
    text.innerHTML= 'press space key to stop sounds';
    targetNode.appendChild(text);
  }
}



function getLabelAndFreq(note) {
  let label;
  let freq;
  if (typeof note === 'string') {
    freq = Convert.freqFromNote(note);
    label = note.replace('b', '♭');
  } else if (typeof note === 'number') {
    freq = note;
    label = String(Convert.round(freq, 1));
  }
  return { label, freq };
}
