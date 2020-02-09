import React from 'react';

export default function Choice(action, label) {
  const classNames = ['key', 'choice'].join(' ');
  return (
    <div id={id} className={classeNames} onClick={action}>
      {label}
    </div>
  );
}
