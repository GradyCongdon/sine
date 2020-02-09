
// PRESETS
//
function normal() {
  return () => {
    content.innerHTML = '';
    let notes = [
      'A4',
      'Bb4',
      'B4',
      'C4',
      'Db4',
      'D4',
      'Eb4',
      'E4',
      'F4',
      'Gb4',
      'G4',
      'Ab5',
      'A5',
    ];
    notes.forEach(note => createSynthKey(note));
    addSequencer();
    areKeysPresent();
  };
}

// μικρός tonal
function mikros(octaveDivisions = 33) {
  return () => {
    content.innerHTML = '';
    getFreqsFromDivisions(octaveDivisions).forEach(freq =>
      createSynthKey(freq)
    );
    areKeysPresent();
  };
}
