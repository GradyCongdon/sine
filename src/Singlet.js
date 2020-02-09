import React from 'react';
import { round } from './convert';

export default function Singlet({note, freq, label, toggleAction}) {
  console.log('singlet', note);
  const frequencyRounded = round(freq, 3);
  const dataSet = { frequency: frequencyRounded };

  return (
    <div id={note} className="key singlet" dataset={dataSet} onKeyDown={toggleAction}>
      {label}
    </div>
  );
}
