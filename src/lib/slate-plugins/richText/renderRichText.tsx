import React from 'react';
import { SlatePlugin } from '~/lib/slate-plugins';
import { MARKS } from '../utils/constants';

export const renderRichText = (): SlatePlugin => {
  return {
    renderMark: (props, next) => {
      const { children, mark, attributes } = props;

      switch (mark.type) {
        case MARKS.Bold:
          return <strong {...attributes}>{children}</strong>;
        case MARKS.Italic:
          return <em {...attributes}>{children}</em>;
        case MARKS.Underlined:
          return <u {...attributes}>{children}</u>;
        default:
          return next();
      }
    },
  };
};
