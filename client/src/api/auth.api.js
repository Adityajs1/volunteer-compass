import apiClient from './client';

export const registerApi = async (data) => {
  return apiClient.post('/auth/register', data);
};

export const loginApi = async (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const getMeApi = async () => {
  return apiClient.get('/auth/me');
};

export const forgotPasswordApi = async (email) => {
  return apiClient.post('/auth/forgot-password', { email });
};
