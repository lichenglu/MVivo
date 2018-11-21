import React from 'react';
import { RenderMarkProps } from 'slate-react';

import { TimeStampContextConsumer } from '../timedText/timeStateContext';

export const TimedText = ({
  mark,
  attributes,
  children,
}: Partial<RenderMarkProps>) => (
  // For some reason, this component does not get re-rendered when context value
  // changes (might be a slatejs issue). So currently, currentTime is not used
  // at all. Instead, text highlighting is changed by jQuery in the parent component
  <TimeStampContextConsumer>
    {({ currentTime, changeAudioProgress }) => {
      const startTime = mark!.data.get('startTime');
      const endTime = mark!.data.get('endTime');
      return (
        <span
          {...attributes}
          className="timestamped-text"
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
