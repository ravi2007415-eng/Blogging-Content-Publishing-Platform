import axiosInstance from './axiosConfig';

export const bookmarkApi = {
  toggleBookmark: async (blogId) => {
    const res = await axiosInstance.post(`/blogs/${blogId}/bookmark`);
    return res.data;
  },
  getMyBookmarks: async () => {
    const res = await axiosInstance.get('/bookmarks/my-bookmarks');
    return res.data;
  },
};
