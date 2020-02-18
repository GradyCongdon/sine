import React, { Component } from 'react';
import Oscillator from './Oscillator';
import Keyboard from './Keyboard';
import Note, { NoteView } from './Note';

import { getFreqsFromDivisions } from './util';



export default class Synth extends Component {
  constructor(props) {
    super(props);
    const { webAudio, divisions } = props;

    const keyboard = new Keyboard(divisions);
    const freqencies = getFreqsFromDivisions(divisions);
    const oscillators = freqencies.map(f => new Oscillator(webAudio, f));

    this.state = {
      webAudio,
      keyboard,
      oscillators,
    }
  }

  render() {
    return (
      <SynthView oscillators={this.state.oscillators} keyboard={this.state.keyboard} />
    );
  }

}


const row = (n, i, len) => i !== len - 1 ? (i + 1) % n :  (i + (n - 1)) % n;
const col = (n, i, len) => i !== len - 1 ? `${i + 1} / span ${n}` : `${i + (n - 1)} / span ${n}`;
// const color = (n, i, len) => i !== len - 1 ? 'white' :  'red';

function SynthView({oscillators, keyboard}) {
  const len = oscillators.length;
  const noteViews = oscillators.map((o,i) => {
    const style = {
      gridRow: row(3, i, len),
      gridColumn: col(3, i, len),
    }
    const key = keyboard.get(i);
    return (
      <Note
        key={key} 
        style={style} 
        name={key}
        oscillator={o}
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


