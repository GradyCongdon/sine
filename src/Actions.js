
export function stopAll(event) {
  for (let g in synth.gains) {
    synth.gains[g].gain.value = 0;
  }
  const onKeys = Array.from(content.getElementsByClassName('on'));
  onKeys.forEach(el => el.classList.remove('on'));
  event.preventDefault();
}
