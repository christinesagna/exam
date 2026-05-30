import axiosClient from './api/axiosClient';

export const authService = {
  register: async (payload) => {
    const { data } = await axiosClient.post('/auth/register', payload);
    return data;
  },

  login: async (payload) => {
    const { data } = await axiosClient.post('/auth/login', payload);
    return data;
  },

  logout: async () => {
    const { data } = await axiosClient.post('/auth/logout');
    return data;
  },

  getMe: async () => {
    const { data } = await axiosClient.get('/auth/me');
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await axiosClient.put('/auth/profile', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
