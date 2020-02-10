import React from 'react';
import NoteView from './NoteView';
import { getKeyboardFromDivisions } from './util';

export default function SynthView({synth}) {
    const keyboard = getKeyboardFromDivisions(synth.notes.length);
    
    const notes = synth.notes.map((n,i) => {
      const letter = keyboard[i];
      return (
        <NoteView 
          key={letter}
          label={letter}
          note={n.note}
          on={n.on}
          off={n.off}
        />
      );
    });

    return (
      <div id="synth" className="synth content">
        {notes}
      </div>
    );
}
