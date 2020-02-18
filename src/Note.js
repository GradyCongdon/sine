import React, { Component } from 'react';
import Oscillator from './Oscillator';
// View
import { round } from './convert';

const up = false;
const down = true;

export default class Note extends Component {
  constructor(props) {
    super(props);
    const { name, oscillator } = props;
    this.name = name;

    this.state = {
      postion: down,
      oscillator: oscillator
    }

    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
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

  render() {
    return (
      <NoteView name={this.props.name} style={this.props.style} on={this.on}/>
    );

  }

}

export function NoteView({name, style, on}) {
  return (
    <div 
      className="key singlet" 
      id={name}
      style={style}
      onClick={on}
    >
      {name}
    </div>
  );
}
