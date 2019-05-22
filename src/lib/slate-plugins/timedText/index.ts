import { MARKS } from '../utils/constants';

import { calculateTextColor } from './calculateTextState';
import { RenderTimedText } from './renderTimedText';

interface TimedText {
  type?: MARKS;
}

export default function TimedText({ type = MARKS.TimedText }: TimedText) {
  return {
    ...RenderTimedText({ type }),
  };
}

export { calculateTextColor };
