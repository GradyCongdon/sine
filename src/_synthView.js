import React from 'react';
import Note from './Note';
import { getKeyboardFromDivisions } from './util';

const row = (n, i, len) => i !== len - 1 ? (i + 1) % n :  (i + (n - 1)) % n;
const col = (n, i, len) => i !== len - 1 ? `${i + 1} / span ${n}` : `${i + (n - 1)} / span ${n}`;
const color = (n, i, len) => i !== len - 1 ? 'white' :  'red';

export default function SynthView({synth}) {
  const keyboard = getKeyboardFromDivisions(synth.notes.length);

 
  const len = synth.notes.length;
  const notes = synth.notes.map((n,i) => {
    const letter = keyboard[i];
    console.log('letter', letter);
    const styles = {
      gridRow: row(3, i, len),
      gridColumn: col(3, i, len),
    }
    return (
      <Note 
        styles={styles}
        key={letter}
        label={letter}
        note={n.note}
        on={n.on}
        off={n.off}
      />
    );
  });

  const styles = {
    display: 'grid',
    gridTemplateColumns: `repeat(36, 11px)`,
    gridTemplateRows: `repeat(3, 33px)`,
    gridGap: '1px'
  }

  return (
    <div id="synth" style={styles}>
      {notes}
    </div>
  );
}
