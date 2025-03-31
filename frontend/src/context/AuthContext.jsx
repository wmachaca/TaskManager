import { createContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          provider: decoded.provider || 'credentials',
        });
      } catch (error) {
        console.error('Token decoding failed:', error);
        logout();
      }
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/api/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(jwtDecode(res.data.token));
      return { success: true }; //
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        code: error.response?.data?.code,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
