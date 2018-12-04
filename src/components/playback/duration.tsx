import React from 'react';
import { formatSeconds } from '~/lib/utils';

export interface DurationProps {
  seconds: number;
}

export function Duration({ seconds, ...rest }: DurationProps) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} {...rest}>
      {formatSeconds(seconds)}
    </time>
  );
}
