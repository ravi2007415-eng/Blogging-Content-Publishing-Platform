import axiosInstance from './axiosConfig';

export const blogApi = {
  getBlogs: async (page = 0, size = 10) => {
    const res = await axiosInstance.get(`/blogs?page=${page}&size=${size}`);
    return res.data;
  },
  getBlogById: async (id) => {
    const res = await axiosInstance.get(`/blogs/${id}`);
    return res.data;
  },
  getBlogBySlug: async (slug) => {
    const res = await axiosInstance.get(`/blogs/slug/${slug}`);
    return res.data;
  },
  createBlog: async (blogData) => {
    const res = await axiosInstance.post('/blogs', blogData);
    return res.data;
  },
  updateBlog: async (id, blogData) => {
    const res = await axiosInstance.put(`/blogs/${id}`, blogData);
    return res.data;
  },
  deleteBlog: async (id) => {
    const res = await axiosInstance.delete(`/blogs/${id}`);
    return res.data;
  },
  getMyBlogs: async () => {
    const res = await axiosInstance.get('/blogs/my-blogs');
    return res.data;
  },
  searchBlogs: async (query, page = 0) => {
    const res = await axiosInstance.get(`/search?q=${encodeURIComponent(query)}&page=${page}`);
    return res.data;
  },
  filterByCategory: async (slug, page = 0) => {
    const res = await axiosInstance.get(`/search/category/${slug}?page=${page}`);
    return res.data;
  },
  filterByTag: async (slug, page = 0) => {
    const res = await axiosInstance.get(`/search/tag/${slug}?page=${page}`);
    return res.data;
  },
  toggleLike: async (blogId) => {
    const res = await axiosInstance.post(`/blogs/${blogId}/like`);
    return res.data;
  },
};
