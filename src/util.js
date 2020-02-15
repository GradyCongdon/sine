
export function getFreqsFromDivisions(octaveDivisions = 33) {
  const freqs = [];
  for (let i = 0; i < octaveDivisions; i++) {
    let freq = 440 + i * (440 / octaveDivisions);
    freqs.push(freq);
  }
  return freqs;
}

