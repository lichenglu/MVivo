import React from 'react';

export const TimeStampContext = React.createContext({
  changeAudioProgress: (time: number) => console.log('changeAudioProgress'),
  currentTime: 0,
});
export const TimeStampContextProvider = TimeStampContext.Provider;
export const TimeStampContextConsumer = TimeStampContext.Consumer;
