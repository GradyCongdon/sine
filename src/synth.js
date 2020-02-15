import React, { Component } from 'react';
import Keyboard from './Keyboard';
import Note, { NoteView } from './Note';

import { getFreqsFromDivisions } from './util';



export default class Synth extends Component {
  constructor(props) {
    super(props);
    const { webAudio, divisions } = props;

    const keyboard = new Keyboard(divisions);
    const freqencies = getFreqsFromDivisions(divisions);

    const notes = [];
    for (let i = 0; i < freqencies.length; i++) {
      const freq = freqencies[i];
      const osc = new Oscillator(webAudio, freq);

      const key = keyboard.get(i);
      const n = new Note(osc, key);
      notes.push(n);
    }

    this.state = {
      webAudio,
      keyboard,
      notes,
    }
  }

  render() {
    return (
      <SynthView notes={this.state.notes} />
    );
  }

}


const row = (n, i, len) => i !== len - 1 ? (i + 1) % n :  (i + (n - 1)) % n;
const col = (n, i, len) => i !== len - 1 ? `${i + 1} / span ${n}` : `${i + (n - 1)} / span ${n}`;
// const color = (n, i, len) => i !== len - 1 ? 'white' :  'red';

function SynthView({notes}) {
  const len = notes.length;
  const noteViews = notes.map((n,i) => {
    const style = {
      gridRow: row(3, i, len),
      gridColumn: col(3, i, len),
    }
    console.log('name', n.name);
    return (
      <Note
        key={i} 
        style={style} 
        name={n.name} 
        on={n.on}
      />
    );
  });

  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(36, 11px)`,
    gridTemplateRows: `repeat(3, 33px)`,
    gridGap: '1px'
  }

  return (
    <div id="synth" style={style}>
      {noteViews}
    </div>
  );
}


