// api/auth.js
import api from './axiosInstance.js';

// Login: send email and password
export const login = (email, password) => api.post('/auth/login', { email, password });

// Register: accepts FormData directly
export const register = (formData) => {
  return api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' } // ensures files are sent properly
  });
};

export const logout = () => api.post('/auth/logout');


// Reset password (if needed)
export const resetPassword = (body) => api.post('/auth/reset-password', body);
