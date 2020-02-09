import React from 'react';
import { round } from './Convert';
import { keyboard } from './ui';

function Singlet({label}) {
  const inner = keyboard || label
  return (
    <div id={note} className="key singlet" dataSet={dataset}>
      <SingletLabel label="label" />
    </div>
  );
}

export default App;

