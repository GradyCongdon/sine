import React, { Component } from 'react';
import Oscillator from './Oscillator';
import Keyboard from './Keyboard';
import Note from './Note';

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
      <SynthView 
        oscillators={this.state.oscillators}
        keyboard={this.state.keyboard}
      />
    );
  }

}



function SynthView({oscillators, keyboard}) {
  const len = oscillators.length;
  const noteViews = oscillators.map((osc,i) => {
    const keyStyle = Keyboard.getKeyStyle(i, len);
    const letter = keyboard.get(i);
    return (
      <Note
        key={letter}
        style={keyStyle} 
        name={letter}
        oscillator={osc}
      />
    );
  });

  const containerStyle = Keyboard.getContainerStyle(33);
  return (
    <div id="synth" style={containerStyle}>
      {noteViews}
    </div>
  );
}


