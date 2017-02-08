const notes = [ 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'];

export class Convert {

  static freqFromStep(steps, fixed = 440) {
    const a = 2 ** (1/12);
    return fixed * Math.pow(a, steps);
  }

  static noteFromStep(step) {
    const note = step % notes.length;
    return notes[note];
  }

  static stringToNote(str) {
    note = str.slice(0, str.length);
    octave = str.slice(str.length-1);
    return { note, octave };
  }

  static freqFromNote(inputNote) {
    if (typeof inputNote === 'String') { 
      inputNote = stringToNote(inputNote);
    }
    const { note, octave } = inputNote;
    const semi = notes.indexOf(note);
    const freq = freqFromStep(semi);
    const base = octave - 4;
    let out;
    if (base > 0) {
      out = freq * n.octave;
    } else if (base < 0) {
      out = freq / octave;
    } else {
      out = freq;
    }
    return out;
  }

  static round(number, precision) {
      var factor = Math.pow(10, precision);
      var tempNumber = number * factor;
      var roundedTempNumber = Math.round(tempNumber);
      return roundedTempNumber / factor;
  };
}
