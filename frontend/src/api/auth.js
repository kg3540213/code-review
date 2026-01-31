import api from './axios';

export const signup = (name, email, password) =>
  api.post('auth/signup', { name, email, password });

export const login = (email, password) =>
  api.post('auth/login', { email, password });

export const googleLogin = (credential) =>
  api.post('auth/google', { credential });

export const logout = () => api.post('auth/logout');
