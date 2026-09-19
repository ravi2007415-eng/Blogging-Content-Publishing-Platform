import axiosInstance from './axiosConfig';

export const authApi = {
  login: async (credentials) => {
    const payload = {
      usernameOrEmail: (credentials.usernameOrEmail || credentials.email || credentials.username || '').trim(),
      password: credentials.password || '',
    };
    const res = await axiosInstance.post('/auth/login', payload);
    return res.data;
  },
  register: async (userData) => {
    const payload = {
      fullName: (userData.fullName || '').trim(),
      username: (userData.username || '').trim(),
      email: (userData.email || '').trim().toLowerCase(),
      password: userData.password || '',
    };
    const res = await axiosInstance.post('/auth/register', payload);
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
