
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
}
