import axiosInstance from './axiosConfig';
import { MOCK_NEWS } from '../mockData';

export const newsApi = {
  getAllNews: async (category, subCategory, sort) => {
    try {
      const params = {};
      if (category) params.category = category;
      if (subCategory) params.subCategory = subCategory;
      if (sort) params.sort = sort;

      const response = await axiosInstance.get('/news', { params });
      return response.data;
    } catch (err) {
      console.warn('Backend API /news unavailable, falling back to mock data:', err);
      let list = [...MOCK_NEWS];
      if (category) {
        list = list.filter(n => n.categoryName?.toLowerCase() === category.toLowerCase());
      }
      if (subCategory) {
        list = list.filter(n => n.subCategoryName?.toLowerCase() === subCategory.toLowerCase());
      }
      if (sort === 'oldest') {
        list.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
      } else if (sort === 'popular') {
        list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
      } else {
        list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      }
      return list;
    }
  },

  getLatestNews: async (limit = 10) => {
    try {
      const response = await axiosInstance.get(`/news/latest?limit=${limit}`);
      return response.data;
    } catch (err) {
      console.warn('Backend API /news/latest unavailable, falling back to mock data:', err);
      return MOCK_NEWS.slice(0, limit);
    }
  },

  getBreakingNews: async () => {
    try {
      const response = await axiosInstance.get('/news/breaking');
      return response.data;
    } catch (err) {
      return MOCK_NEWS.filter(n => n.isBreaking);
    }
  },

  getTrendingNews: async () => {
    try {
      const response = await axiosInstance.get('/news/trending');
      return response.data;
    } catch (err) {
      return MOCK_NEWS.filter(n => n.isTrending);
    }
  },

  getTopStories: async () => {
    try {
      const response = await axiosInstance.get('/news/top-stories');
      return response.data;
    } catch (err) {
      return MOCK_NEWS.filter(n => n.isTopStory);
    }
  },

  getNewsByIdOrSlug: async (idOrSlug) => {
    try {
      const response = await axiosInstance.get(`/news/${idOrSlug}`);
      return response.data;
    } catch (err) {
      const found = MOCK_NEWS.find(n => String(n.id) === String(idOrSlug) || n.slug === idOrSlug) || MOCK_NEWS[0];
      return found;
    }
  },

  searchNews: async (query) => {
    try {
      const response = await axiosInstance.get(`/news/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (err) {
      return MOCK_NEWS.filter(n => 
        n.title.toLowerCase().includes(query.toLowerCase()) || 
        n.summary.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
};
