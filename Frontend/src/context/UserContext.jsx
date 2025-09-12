import React, { createContext, useState, useContext, useEffect } from 'react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const userState = { ...userData, isLoggedIn: true };
    sessionStorage.setItem('user', JSON.stringify(userState));
    setUser(userState);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser({
      name: 'Guest',
      role: 'Visitor',
      department: '',
      email: '',
      isLoggedIn: false
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};