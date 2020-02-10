
export default class Trigger {
  constructor(name) {
    this.state = false;

    const { on, off } = this.createNoteActions(note, );
    return {
      on, 
      off
    };

  }

  createNoteActions(note, check) {
    const on = event => {
      if (event.key === check()) {
        this.toggle(note, on);
      }
    };

    const off = event => {};

    return {
      on,
      off,
    };
  }


  toggle(key, on) {
    if (on) {
      this.on(key);
    } else {
      this.off(key);
    }
  }
}
