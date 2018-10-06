export const colorPalette = [
  '#607D8B',
  '#177cb0',
  '#b9b612',
  '#789262',
  '#FF9800',
  '#ed5736',
  '#795548',
  '#7C4DFF',
  '#494166',
  '#c3272b',
  '#CDDC39',
  '#009688',
  '#a3e2c5',
  '#415065',
  '#424040',
  '#c2185b',
  '#a98175',
  '#9d2932',
  '#efdeb0',
];

// from https://gradients.cssgears.com/
export const gradients = [
  { from: '#E3E3E3', to: '#5D6874', degree: 135 },
  { from: '#0FF0B3', to: '#036ED9', degree: 135 },
  { from: '#c3ec52', to: '#0ba29d', degree: 135 },
  { from: '#C56CD6', to: '#3425AF', degree: 135 },
  { from: '#184e68', to: '#57ca85', degree: 135 },
  { from: '#7117ea', to: '#ea6060', degree: 135 },
  { from: '#17ead9', to: '#6078ea', degree: 135 },
  { from: '#42e695', to: '#3bb2b8', degree: 135 },
  { from: '#F5515F', to: '#A1051D', degree: 135 },
];

export const generateGradient = ({
  from,
  to,
  degree,
}: {
  from: string;
  to: string;
  degree: number;
}) => {
  return `linear-gradient(${degree}deg, ${from} 0%,${to} 100%);`;
};
