import axiosInstance from './axiosConfig';

export const eventApi = {
  getEvents: async (category = null, subCategory = null, status = null) => {
    let url = '/events?';
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (subCategory) url += `subCategory=${encodeURIComponent(subCategory)}&`;
    if (status) url += `status=${encodeURIComponent(status)}`;
    const res = await axiosInstance.get(url);
    return res.data;
  },
  getEventById: async (id) => {
    const res = await axiosInstance.get(`/events/${id}`);
    return res.data;
  },
  createEvent: async (eventData) => {
    const res = await axiosInstance.post('/events', eventData);
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await axiosInstance.delete(`/events/${id}`);
    return res.data;
  },
};
