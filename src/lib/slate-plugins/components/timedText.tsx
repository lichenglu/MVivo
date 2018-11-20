import React from 'react';
import { RenderMarkProps } from 'slate-react';
import styled from 'styled-components';

import { TimeStampContextConsumer } from '../timedText/timeStateContext';

import { Colors } from '~/themes';

export const TimedText = ({ mark, attributes, children }: RenderMarkProps) => (
  <TimeStampContextConsumer>
    {({ currentTime, changeAudioProgress }) => {
      const startTime = mark.data.get('startTime');
      const farAway = Math.abs(startTime - currentTime) > 20;
      const close =
        0.5 < Math.abs(startTime - currentTime) &&
        Math.abs(startTime - currentTime) <= 20;
      let color = '#000';
      if (farAway) {
        color = Colors.shadowGray;
      }
      if (close) {
        color = Colors.textLightGray;
      }

      return (
        <span
          {...attributes}
          style={{ color }}
          onClick={() => changeAudioProgress(startTime)}
        >
          {children}
        </span>
      );
    }}
  </TimeStampContextConsumer>
);
