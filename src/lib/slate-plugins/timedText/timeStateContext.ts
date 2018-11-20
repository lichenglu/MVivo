import React from 'react';

export const TimeStampContext = React.createContext({
  currentTime: 200,
  changeAudioProgress: (time: number) => console.log('changeAudioProgress'),
});
export const TimeStampContextProvider = TimeStampContext.Provider;
export const TimeStampContextConsumer = TimeStampContext.Consumer;
