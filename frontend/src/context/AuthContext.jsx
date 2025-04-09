import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import apiClient from '../utils/apiClient';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // Initialize from localStorage only once
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        return storedToken;
      } catch {
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  // Enhanced setAuthToken with immediate user update
  const setAuthToken = useCallback(newToken => {
    try {
      const decoded = jwtDecode(newToken);
      console.log('Decoded Google token:', decoded);

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser({
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        provider: decoded.provider || 'google',
      });
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
      return false;
    }
  }, []);

  useEffect(() => {
    // First: Check for token in URL (Google redirect case)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      // If we have a token in URL, use it and clean the URL
      setAuthToken(urlToken);
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // Second: Handle existing token from localStorage
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
      setAuthToken(res.data.token);
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

  const loginWithGoogle = async googleCredential => {
    try {
      const res = await apiClient.post('/api/auth/google', { token: googleCredential });
      const jwtToken = res.data.token; // this must be your own JWT with userId
      const success = setAuthToken(jwtToken); // this already updates user/token
      return { success };
    } catch (error) {
      console.error('Google login failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Google login failed',
      };
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, setAuthToken, loginWithGoogle, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is a React node and is required
};

export default AuthContext;
