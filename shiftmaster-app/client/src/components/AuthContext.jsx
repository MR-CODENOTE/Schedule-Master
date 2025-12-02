import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // New loading state

  useEffect(() => {
    const storedToken = sessionStorage.getItem('shiftMasterToken');
    const storedUser = sessionStorage.getItem('shiftMasterUser');

    if (storedToken && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from sessionStorage', e);
        sessionStorage.removeItem('shiftMasterToken');
        sessionStorage.removeItem('shiftMasterUser');
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const login = (token, user) => {
    sessionStorage.setItem('shiftMasterToken', token);
    sessionStorage.setItem('shiftMasterUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    sessionStorage.removeItem('shiftMasterToken');
    sessionStorage.removeItem('shiftMasterUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);