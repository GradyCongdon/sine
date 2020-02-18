import React, { Component } from 'react';

export default class Note extends Component {
  constructor(props) {
    super(props);
    const { name, oscillator } = props;
    this.name = name;

    this.state = {
      playing: false,
      oscillator: oscillator
    }

    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  get frequency() {
    return this.state.oscillator.frequency.value;
  }

  get volume() {
    return this.state.oscillator.volume;
  }

  on() {
    this.setState({playing: true});
    this.state.oscillator.on();
  }

  off() {
    this.setState({playing: false});
    this.state.oscillator.off();
  }

  toggle() {
    return this.state.playing ? this.off() : this.on();
  }


  render() {
    return (
      <NoteView 
        name={this.props.name}
        style={this.props.style}
        on={this.toggle}
        playing={this.state.playing}
      />
    );

  }

}

export function NoteView({name, style, on, playing}) {
  const s = {
    backgroundColor: playing ? 'red' : 'transparent',
  }
  return (
    <div 
      className="key singlet" 
      id={name}
      style={{...style, ...s}}
      onClick={on}
    >
      {name}
    </div>
  );
}
