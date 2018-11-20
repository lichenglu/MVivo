import React from 'react';
import { RenderMarkProps } from 'slate-react';
import styled from 'styled-components';

import { TimeStampContextConsumer } from '../timedText/timeStateContext';

import { Colors } from '~/themes';

export const TimedText = ({ mark, attributes, children }: RenderMarkProps) => (
  <TimeStampContextConsumer>
    {({ currentTime, changeAudioProgress }) => {
      const startTime = mark.data.get('startTime');
      const endTime = mark.data.get('endTime');
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
