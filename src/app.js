import React, { Component } from 'react';
import WebAudio from './WebAudio';
import Synth from './Synth';
import { test } from './index';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      webAudio: null,
      divisions: 33,
    }
    this.startAudio = this.startAudio.bind(this);
  }

  startAudio() {
    this.setState({webAudio: new WebAudio()});
    // test();
  }

  render() {
    if (!this.state.webAudio) {
      return <button onClick={this.startAudio}>start</button>
    } 

    return (
      <div className="content">
        <Synth webAudio={this.state.webAudio} divisions={this.state.divisions} />
      </div>
    );
  }
}

export default App;

