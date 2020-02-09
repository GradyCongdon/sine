
export function getFreqsFromDivisions(octaveDivisions = 33) {
  const freqs = [];
  for (let i = 0; i < octaveDivisions; i++) {
    let freq = 440 + i * (440 / octaveDivisions);
    freqs.push(freq);
  }
  return freqs;
}

export function getKeyboardFromDivisions(octaveDivisions = 33) {
  const keyboard = [
    'q',
    'a',
    'z',
    'w',
    's',
    'x',
    'e',
    'd',
    'c',
    'r',
    'f',
    'v',
    't',
    'g',
    'b',
    'y',
    'h',
    'n',
    'u',
    'j',
    'm',
    'i',
    'k',
    ',',
    'o',
    'l',
    '.',
    'p',
    ';',
    '/',
    '[',
    "'",
    ']',
  ];
  return keyboard;
}
