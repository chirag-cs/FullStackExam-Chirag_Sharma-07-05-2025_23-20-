import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      console.log('Token found in localStorage:', savedToken);
      fetchUser(savedToken);
    }
  }, []);
  

  const fetchUser = async (jwt: string) => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Invalid token or user fetch failed');
      logout();
    }
  };

  const login = (jwt: string) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    fetchUser(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
