import React from 'react';

export interface DurationProps {
  seconds: number;
}

export function Duration({ seconds, ...rest }: DurationProps) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} {...rest}>
      {format(seconds)}
    </time>
  );
}

function format(seconds: number) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

function pad(str: string | number) {
  return ('0' + str).slice(-2);
}
