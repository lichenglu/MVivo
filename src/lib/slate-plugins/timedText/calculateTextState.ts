import { Colors } from '~/themes';

export const calculateTextColor = (curTime: number, startTime: number) => {
  // default to black color at the beginning
  if (curTime === 0) {
    return Colors.textBlack;
  }

  const threshold = 0.65;

  const diff = curTime - startTime;
  const hasPassed = diff > threshold;
  const isBefore = diff < -threshold;

  let color = Colors.bloodOrange;

  if (hasPassed) {
    color = Colors.textBlack;
  }
  if (isBefore) {
    color = Colors.textLightGray;
  }

  return color;
};
