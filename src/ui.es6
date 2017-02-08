export class UI {

  static makeKey(key) {
    const ivory = document.createElement('div');
    ivory.id = key;
    ivory.innerHTML = key;
    ivory.dataset.frequency = round(t(key), 3);
    ivory.classList.add('key');
    if (key.match('b')) ivory.classList.add('ebony');
    ivory.addEventListener('click', toggle);
    return ivory;
  }

  static makeStep(num) {
    if (!num) throw Error ('no step number');
    const step = document.createElement('div');
    step.id = `step-${num}`;
    step.addEventListener('click', sequence);
    return step;
  }
}

export function toggle(event) {
  const key = event.target;
  const on = key.classList.toggle('on');
  // Lookup components on target
  // Run on funcs for each
  if (on) { 
    // FIXME synth global
    synth[key.id].gain.gain.value = 0.5;
  } else {
    synth[key.id].gain.gain.value = 0;
  }
}
