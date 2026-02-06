'use client';

import React, { useState } from 'react';
import { HiSearch, HiCheck } from 'react-icons/hi';
import CourseCard from './CourseCard';

interface Props {
  initialCourses: any[];
  categories: any[];
  userId?: string | null;
}

export default function CourseCatalog({ initialCourses, categories, userId }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // === LOGIKA FILTER ===
  const filteredCourses = initialCourses.filter((course) => {
    const matchCategory = selectedCategory === 'Semua' ? true : course.category?.name === selectedCategory;
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="w-full mt-25 text-[#2e385b] font-sans">
        
        {/* === HEADER & SEARCH SECTION === */}
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-12 text-center">
          <p className="text-sm font-bold mb-2 tracking-wide uppercase text-gray-500">Katalog Kelas</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-[#2e385b]">Kursus Online Gratis</h1>
          
          {/* Search Bar - Style Rounded Full & Shadow Halus */}
          <div className="max-w-2xl mx-auto relative group">
            <input 
               type="text" 
               placeholder="Cari kelas kursus gratis...." 
               className="w-full pl-12 pr-6 py-4 rounded-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#2e385b] focus:border-transparent outline-none transition-all shadow-sm group-hover:shadow-md"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-hover:text-[#2e385b] transition-colors" />
          </div>
        </div>

        {/* === MAIN LAYOUT (SIDEBAR + GRID) === */}
        <div className="max-w-7xl mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 1. SIDEBAR KATEGORI (KIRI) */}
          <aside className="w-full lg:w-64 flex-shrink-0 border border-gray-300 rounded-xl p-6 bg-white sticky top-28 shadow-sm">
             <h3 className="font-bold text-[#2e385b] mb-5 text-base">Topik</h3>
             
             <div className="space-y-3">
               {/* Pilihan 'Semua' */}
               <label className="flex items-center gap-3 cursor-pointer group select-none">
                  {/* Custom Radio Button */}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${selectedCategory === 'Semua' ? 'bg-[#2e385b] border-[#2e385b]' : 'bg-white border-gray-400 group-hover:border-[#2e385b]'}`}>
                      {selectedCategory === 'Semua' && <HiCheck className="text-white text-xs" />}
                  </div>
                  
                  <input 
                    type="radio" 
                    name="category" 
                    className="hidden"
                    checked={selectedCategory === 'Semua'}
                    onChange={() => setSelectedCategory('Semua')}
                  />
                  <span className={`text-sm font-medium transition-colors ${selectedCategory === 'Semua' ? 'text-[#2e385b] font-bold' : 'text-gray-600 group-hover:text-[#2e385b]'}`}>
                    Semua
                  </span>
               </label>

               {/* Looping Kategori dari Database */}
               {categories.map((cat) => (
                 <label key={cat.id} className="flex items-center gap-3 cursor-pointer group select-none">
                    {/* Custom Radio Button */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${selectedCategory === cat.name ? 'bg-[#2e385b] border-[#2e385b]' : 'bg-white border-gray-400 group-hover:border-[#2e385b]'}`}>
                        {selectedCategory === cat.name && <HiCheck className="text-white text-xs" />}
                    </div>

                    <input 
                      type="radio" 
                      name="category" 
                      className="hidden"
                      checked={selectedCategory === cat.name}
                      onChange={() => setSelectedCategory(cat.name)}
                    />
                    <span className={`text-sm font-medium transition-colors ${selectedCategory === cat.name ? 'text-[#2e385b] font-bold' : 'text-gray-600 group-hover:text-[#2e385b]'}`}>
                      {cat.name}
                    </span>
                 </label>
               ))}
             </div>
          </aside>

          {/* 2. GRID KURSUS (KANAN) */}
          <div className="flex-1 w-full">
             {/* Judul Bagian Kanan Berubah Sesuai Filter */}
             <h3 className="font-bold text-[#2e385b] mb-6 text-lg">
                {selectedCategory === 'Semua' ? 'Semua Kelas' : `Kelas ${selectedCategory}`}
             </h3>

             {filteredCourses.length === 0 ? (
               <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                 <p className="text-gray-500 font-medium">Tidak ada kursus yang ditemukan untuk kategori ini.</p>
                 <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory('Semua')}} 
                    className="mt-3 text-[#2e385b] font-bold hover:underline text-sm"
                 >
                    Reset Filter
                 </button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredCourses.map((course) => (
                   <CourseCard 
                     key={course.id} 
                     course={course} 
                     user={{ id: userId }} 
                     isEnrolled={course.enrollments?.length > 0}
                     isCompleted={course.isCompleted} 
                   />
                 ))}
               </div>
             )}
          </div>

        </div>
    </div>
  );
}