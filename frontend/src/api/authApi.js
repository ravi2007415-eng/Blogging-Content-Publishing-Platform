import axiosInstance from './axiosConfig';

export const authApi = {
  login: async (credentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await axiosInstance.post('/auth/register', userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await axiosInstance.put('/users/profile', profileData);
    return res.data;
  },
};
