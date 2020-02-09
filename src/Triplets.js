import React from 'react';
import Singlet from './Singlet';

function Triplets({octaveDivisions = 33}) {
  const freqs = getFreqsFromDivisions(octaveDivisions);
  const keyboard = getKeyboardFromDivisions(octaveDivisions);
  for (let i = 0; i < freqs.length; ) {
    let triplet = [];
    for (let j = 0; j < 3; j++) {
      const singlet = (<Singlet note={freqs[i]} keyboard={keyboard[i]} />);
      triplet.push(ui);
      i++; // increment Outer loop
    }
  }
    const trip = document.createElement('div');
    trip.classList.add('triplet');
    if (target) {
      triplet.forEach(s => trip.appendChild(s));
      target.appendChild(trip);
      return this;
    }
    return trip;
  }
  // document.getElementById(freqs.pop()).classList.add('last-singlet');
  return (
    <div className="keyboard">
      {triplets}
    </div>
  );
}
