// TimerContext.js
import React, { createContext, useContext, useState } from 'react';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [remainingTime, setRemainingTime] = useState('');

  const updateTimer = (newTime) => {
    setRemainingTime(newTime);
  };

  return (
    <TimerContext.Provider value={{ remainingTime, updateTimer }}>
      {children}
    </TimerContext.Provider>
  );
};
