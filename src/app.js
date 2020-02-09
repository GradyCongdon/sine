import React, { Component } from 'react';
import Synth from './Synth';
import Singlet from './Singlet';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      divisions: 33,
      synth: Synth.createFromDivisions(this.state.divisions),
    }
  }

  setDivisions(event) {
    this.setState({
      divisions: event.value
    });
  }

  render() {
    const singlets = this.synth.notes.map(n => (
      <Singlet note={n.note} on={n.on} off={n.off} label={n.label} />
    ));

    return (
      <div id="sine">
        {singlets}
      </div>

    );
  }
}

export default App;

