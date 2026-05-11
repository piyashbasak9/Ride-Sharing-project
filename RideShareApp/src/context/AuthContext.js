import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    const token = await AsyncStorage.getItem('access_token');
    const user = await AsyncStorage.getItem('user_info');
    if (token && user) {
      setUserToken(token);
      setUserInfo(JSON.parse(user));
    }
    setIsLoading(false);
  };

  const login = async (email, password) => {
    console.log('AuthContext.login called', { email, platform: Platform.OS });
    console.log('AuthContext API_BASE_URL', api.defaults.baseURL);
    try {
      const res = await api.post('/login/', { email, password });
      const { access, refresh, user } = res.data;
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      await AsyncStorage.setItem('user_info', JSON.stringify(user));
      setUserToken(access);
      setUserInfo(user);
      return { success: true };
    } catch (error) {
      const debug = error?.response?.data || error?.message || error;
      console.log('AuthContext.login error', debug);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        'Login failed';
      return { success: false, error: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/register/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  const logout = async () => {
    const refresh = await AsyncStorage.getItem('refresh_token');
    if (refresh) await api.post('/logout/', { refresh }).catch(() => {});
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_info']);
    setUserToken(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userInfo, isLoading, login, register, logout, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};