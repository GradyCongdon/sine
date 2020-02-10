import { Component } from 'react';
import Oscillator from './Oscillator';

const up = false;
const down = true;

export default class Note extends Component {
  constructor(name, audio, frequency) {
    super();
    this.state = {
      postion: down,
      oscillator: new Oscillator(audio, frequency, 'sine'),
    }
    this.on.bind(this);
    this.off.bind(this);
  }

  get frequency() {
    return this.state.oscillator.frequency.value;
  }

  get volume() {
    return this.state.oscillator.volume;
  }

  on() {
    this.setState({position: down});
    this.state.oscillator.on();
  }

  off() {
    this.setState({position: up});
    this.state.oscillator.off();
  }

}
