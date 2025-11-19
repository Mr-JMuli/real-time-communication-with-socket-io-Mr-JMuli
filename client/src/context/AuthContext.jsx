import { createContext, useState, useContext } from 'react';
import socket from '../socket/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (token, username) => {
    localStorage.setItem('token', token);
    socket.auth.token = token;
    socket.connect();
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    socket.disconnect();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);