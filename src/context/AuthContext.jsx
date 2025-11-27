import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if token exists in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally, verify token with backend or restore user info
      const storedEmail = localStorage.getItem('user_email');
      const storedUserId = localStorage.getItem('user_id');
      if (storedEmail) {
        setUser({ email: storedEmail, id: storedUserId });
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, userId, authToken) => {
    setUser({ email, id: userId });
    setToken(authToken);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_id', userId);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
