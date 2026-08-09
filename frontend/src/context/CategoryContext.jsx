import React, { createContext, useState, useEffect } from 'react';
import { INITIAL_TAXONOMY } from '../mockData';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('keryx_categories');
    return saved ? JSON.parse(saved) : INITIAL_TAXONOMY;
  });

  useEffect(() => {
    localStorage.setItem('keryx_categories', JSON.stringify(categories));
  }, [categories]);

  // Add a new Main Category dynamically
  const addCategory = (categoryData) => {
    const newCat = {
      id: Date.now(),
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      icon: categoryData.icon || 'Grid',
      description: categoryData.description || '',
      subCategories: []
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  // Add a new Sub-Category to a Main Category dynamically
  const addSubCategory = (parentCategoryId, subData) => {
    const newSub = {
      id: Date.now(),
      name: subData.name,
      slug: subData.slug || subData.name.toLowerCase().replace(/\s+/g, '-'),
      description: subData.description || ''
    };

    setCategories(prev => prev.map(cat => {
      if (cat.id === parentCategoryId || cat.slug === parentCategoryId || cat.name.toLowerCase() === String(parentCategoryId).toLowerCase()) {
        return {
          ...cat,
          subCategories: [...(cat.subCategories || []), newSub]
        };
      }
      return cat;
    }));
    return newSub;
  };

  // Delete a Main Category
  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId && c.slug !== categoryId));
  };

  // Delete a Sub-Category
  const deleteSubCategory = (parentCategoryId, subId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === parentCategoryId || cat.slug === parentCategoryId) {
        return {
          ...cat,
          subCategories: (cat.subCategories || []).filter(sub => sub.id !== subId && sub.slug !== subId)
        };
      }
      return cat;
    }));
  };

  // Get a specific category by slug
  const getCategoryBySlug = (slug) => {
    return categories.find(c => c.slug.toLowerCase() === String(slug).toLowerCase());
  };

  return (
    <CategoryContext.Provider value={{
      categories,
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
