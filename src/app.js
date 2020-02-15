import React, { Component } from 'react';
import WebAudio from './WebAudio';
import Synth from './Synth';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      webAudio: new WebAudio(),
      divisions: 33,
    }
  }

  render() {
    return (
      <div className="content">
        <Synth webAudio={this.state.webAudio} divisions={this.state.divisions} />
      </div>
    );
  }
}

export default App;

