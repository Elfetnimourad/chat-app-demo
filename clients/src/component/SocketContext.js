import { createContext, useState } from "react";

export const socketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [arrOfMesg, setArrOfMesg] = useState(null);

  const sendMessages = (message, id) => {
    setArrOfMesg([...arrOfMesg, { message, id }]);
  };

  return (
    <socketContext.Provider value={{ arrOfMesg, sendMessages }}>
      {children}
    </socketContext.Provider>
  );
};
