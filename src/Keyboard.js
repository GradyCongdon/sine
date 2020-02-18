
const row = (n, i, len) => i !== len - 1 ? (i + 1) % n :  (i + (n - 1)) % n;
const col = (n, i, len) => i !== len - 1 ? `${i + 1} / span ${n}` : `${i + (n - 1)} / span ${n}`;
// const color = (n, i, len) => i !== len - 1 ? 'white' :  'red';

export default class Keyboard {
  constructor(divisions) {
    this.divisions = divisions;
    this.keys = [
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
    this.length = this.keys.length;
  }

  get(i) { 
    if (i < this.length) {
      return this.keys[i];
    }
    throw new Error('key too long for hardcoded key values (write the aa,bb...,aaa,bbb)');
    // TODO long ones
    // const key = [];
    // while (i > keys.length)
  }

  static getKeyStyle(i, len) {
    return {
      gridRow: row(3, i, len),
      gridColumn: col(3, i, len),
    };
  }

  static getContainerStyle(px) {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(36, ${px / 3})`,
      gridTemplateRows: `repeat(3, ${px})`,
      gridGap: '1px'
    };
  }
}
