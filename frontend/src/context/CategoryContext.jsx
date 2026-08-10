import React, { createContext, useState, useEffect } from 'react';
import { categoryApi } from '../api/categoryApi';
import { INITIAL_TAXONOMY } from '../mockData';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(INITIAL_TAXONOMY);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    } catch (err) {
      console.warn('Could not fetch categories from API, using fallback taxonomy:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (categoryData) => {
    try {
      const created = await categoryApi.createCategory(categoryData);
      await fetchCategories();
      return created;
    } catch (err) {
      const newCat = {
        id: Date.now(),
        name: categoryData.name,
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryData.description || '',
        subCategories: []
      };
      setCategories(prev => [...prev, newCat]);
      return newCat;
    }
  };

  const addSubCategory = async (parentCategoryId, subData) => {
    try {
      const created = await categoryApi.createSubCategory(parentCategoryId, subData);
      await fetchCategories();
      return created;
    } catch (err) {
      setCategories(prev => prev.map(cat => {
        if (cat.id === parentCategoryId || cat.slug === parentCategoryId) {
          return {
            ...cat,
            subCategories: [...(cat.subCategories || []), { id: Date.now(), ...subData }]
          };
        }
        return cat;
      }));
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await categoryApi.deleteCategory(categoryId);
      await fetchCategories();
    } catch (err) {
      setCategories(prev => prev.filter(c => c.id !== categoryId && c.slug !== categoryId));
    }
  };

  const deleteSubCategory = async (parentCategoryId, subId) => {
    try {
      await categoryApi.deleteSubCategory(subId);
      await fetchCategories();
    } catch (err) {
      setCategories(prev => prev.map(cat => {
        if (cat.id === parentCategoryId || cat.slug === parentCategoryId) {
          return {
            ...cat,
            subCategories: (cat.subCategories || []).filter(sub => sub.id !== subId)
          };
        }
        return cat;
      }));
    }
  };

  const getCategoryBySlug = (slug) => {
    return categories.find(c => String(c.slug).toLowerCase() === String(slug).toLowerCase());
  };

  return (
    <CategoryContext.Provider value={{
      categories,
      loading,
      fetchCategories,
      addCategory,
      addSubCategory,
      deleteCategory,
      deleteSubCategory,
      getCategoryBySlug
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

