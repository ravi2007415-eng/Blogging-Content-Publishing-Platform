import axiosInstance from './axiosConfig';

export const categoryApi = {
  getCategories: async () => {
    const res = await axiosInstance.get('/categories');
    return res.data;
  },
  getCategoryBySlug: async (slug) => {
    const res = await axiosInstance.get(`/categories/slug/${slug}`);
    return res.data;
  },
  createCategory: async (categoryData) => {
    const res = await axiosInstance.post('/categories', categoryData);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await axiosInstance.delete(`/categories/${id}`);
    return res.data;
  },
};
