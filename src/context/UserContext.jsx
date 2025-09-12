import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Guest',
    role: 'Visitor',
    department: '',
    email: '',
    isLoggedIn: false
  });

  const login = (userData) => {
    setUser({ ...userData, isLoggedIn: true });
  };

  // const logout = () => {
  //   setUser({
  //     name: 'Guest',
  //     role: 'Visitor',
  //     department: '',
  //     email: '',
  //     isLoggedIn: false
  //   });
  // };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};