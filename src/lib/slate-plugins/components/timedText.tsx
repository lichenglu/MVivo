import React from 'react';
import { RenderMarkProps } from 'slate-react';

import { calculateTextColor } from '../timedText/calculateTextState';
import { TimeStampContextConsumer } from '../timedText/timeStateContext';

export const TimedText = ({
  mark,
  attributes,
  children,
}: Partial<RenderMarkProps>) => (
  <TimeStampContextConsumer>
    {({ currentTime, changeAudioProgress }) => {
      const startTime = mark!.data.get('startTime');
      const endTime = mark!.data.get('endTime');

      const color = calculateTextColor(currentTime, startTime);

      return (
        <span
          {...attributes}
          className="timestamped-text"
          style={{ color }}
          data-start={startTime}
          data-end={endTime}
          onClick={() => changeAudioProgress(startTime)}
        >
          {children}
        </span>
      );
    }}
  </TimeStampContextConsumer>
);
