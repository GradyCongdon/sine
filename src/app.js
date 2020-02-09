import React, { Component } from 'react';
import Singlet from './Singlet';
import { getFreqsFromDivisions, getKeyboardFromDivisions } from './util';
import './App.css';

function make(octaveDivisions) {
  const freqs = getFreqsFromDivisions(octaveDivisions);
  const keyboard = getKeyboardFromDivisions(octaveDivisions);
  const singlets = [];
  for (let i = 0; i < freqs.length; i++) {
    const s = (<Singlet note={freqs[i]} label={keyboard[i]} />);
    singlets.push(s);
  }
  return singlets;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      divisions: 33,
    }
  }

  setDivisions(event) {
    this.setState({
      divisions: event.value
    });
  }

  render() {
    const singlets = make(this.state.divisions);
    return (
      <div id="sine">
        {singlets}
      </div>

    );
  }
}

export default App;

