import axiosInstance from './axiosConfig';

export const commentApi = {
  getComments: async (blogId) => {
    const res = await axiosInstance.get(`/blogs/${blogId}/comments`);
    return res.data;
  },
  addComment: async (blogId, content) => {
    const res = await axiosInstance.post(`/blogs/${blogId}/comments`, { content });
    return res.data;
  },
  deleteComment: async (commentId) => {
    const res = await axiosInstance.delete(`/comments/${commentId}`);
    return res.data;
  },
};
