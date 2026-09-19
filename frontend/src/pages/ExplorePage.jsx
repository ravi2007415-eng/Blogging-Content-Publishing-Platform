import React, { useState, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { MOCK_BLOGS } from '../mockData';
import { BlogCard } from '../components/BlogCard';
import { Layers, BookOpen } from 'lucide-react';

export const ExplorePage = () => {
  const { categories } = useContext(CategoryContext);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug || 'technology');

  const activeCatObj = categories.find((c) => c.slug === activeCategory) || categories[0] || { name: 'Technology', slug: 'technology' };
  const categoryBlogs = MOCK_BLOGS.filter(
    (b) => b.category?.slug.toLowerCase() === activeCategory.toLowerCase() || b.category?.name.toLowerCase() === activeCatObj.name.toLowerCase()
  );

  return (
    <div className="explore-page-container space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Layers size={13} />
            <span>Topic Directory</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Explore Knowledge Domains</h1>
          <p className="text-sm text-slate-600">Browse top technology streams, curated articles, and engineering insights.</p>
        </div>

        {/* Grid of Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.slice(0, 9).map((cat) => {
            const count = MOCK_BLOGS.filter((b) => b.category?.slug === cat.slug || b.category?.name.toLowerCase() === cat.name.toLowerCase()).length;
            const isActive = activeCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  isActive 
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className={`font-bold text-base ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>{cat.name}</h4>
                    <span className="badge badge-primary text-[10px]">{count} Posts</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Category Articles */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600" size={20} />
            <h2 className="text-xl font-bold text-slate-900">Articles in {activeCatObj.name} ({categoryBlogs.length})</h2>
          </div>
        </div>

        {categoryBlogs.length > 0 ? (
          <div className="blogs-grid">
            {categoryBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
            No articles found for this topic yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default ExplorePage;
