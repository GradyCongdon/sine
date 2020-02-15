import React from 'react';
import { round } from './convert';

export default function NoteView({note, freq, label, on, off, styles}) {
  const frequencyRounded = round(freq, 3);
  const dataSet = { frequency: frequencyRounded };

  return (
    <div id={note} style={styles} className="key singlet" dataset={dataSet} onClick={on}>
      {label}
    </div>
  );
}
