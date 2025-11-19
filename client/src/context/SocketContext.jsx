// src/context/SocketContext.jsx
import { createContext, useContext } from 'react';
import { useSocket } from '../socket/socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketHook = useSocket();

  return (
    <SocketContext.Provider value={socketHook}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketContext must be used within SocketProvider');
  return context;
};