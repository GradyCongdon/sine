const notes = [ 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'];

export function freqFromStep(steps, fixed = 440) {
  const a = 2 ** (1/12);
  return fixed * Math.pow(a, steps);
}

export function noteFromStep(step) {
  const note = step % notes.length;
  return notes[note];
}

export function stringToNote(str) {
  const octaveIndex = str.match(/[0-9]/).index;
  const octave = str.slice(octaveIndex);
  const note = str.slice(0, octaveIndex);
  return { note, octave };
}

export function freqFromNote(inputNote) {
  if (typeof inputNote !== 'string') return null;
  const { note, octave } =  stringToNote(inputNote);
  const semi = notes.indexOf(note);
  let freq = freqFromStep(semi);
  let diff = octave - 4;
  let dir = Math.sign(diff);
  while (diff) {
    if (dir === 1) {
      freq *= 2;
      diff--;
    } else {
      freq /= 2;
      diff++;
    }
  };
  return freq;
}

export function round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};
