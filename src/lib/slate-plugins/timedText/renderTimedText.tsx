import React from 'react';

import { TimedText } from '../components';

import { SlatePlugin } from '~/lib/slate-plugins';

interface RenderTimedTextOptions {
  type: string;
}

export function RenderTimedText({ type }: RenderTimedTextOptions): SlatePlugin {
  return {
    renderMark: (props, next) => {
      const { mark, attributes, children, editor } = props;
      if (mark.get('type') === type) {
        return (
          <TimedText attributes={attributes} mark={mark}>
            {children}
          </TimedText>
        );
      }
      return next();
    },
  };
}
