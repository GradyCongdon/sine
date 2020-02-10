import React, { Component } from 'react';
import Audio from './Audio';
import Synth from './Synth';
import SynthView from './SynthView';
import { getFreqsFromDivisions } from './util';
import './App.css';

const createSynthFromDivisions = (audio, divisions) => {
  const synth = new Synth(audio);
  const freqs = getFreqsFromDivisions(divisions);
  synth.createNotes(freqs);
  return synth;
}

class App extends Component {
  constructor() {
    super();
    const divisions = 33;
    const audio = new Audio(this.audioContext);

    const synth = createSynthFromDivisions(audio, 33);

    this.state = {
      synth: synth,
      divisions,
    }
  }

  render() {
    return (
      <div className="content">
        <SynthView synth={this.state.synth} />
      </div>
    );
  }
}

export default App;

