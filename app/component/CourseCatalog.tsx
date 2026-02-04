'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiSearch, HiExclamationCircle, HiRefresh, HiPhotograph } from 'react-icons/hi';
import CourseCardButton from './CourseCardButton'; 
import CourseCard from './CourseCard';

interface Props {
  initialCourses: any[];
  categories: any[];
  userId?: string | null;
  dbError?: string | null;
}

export default function CourseCatalog({ initialCourses, categories, userId, dbError }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  if (dbError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-10 max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiExclamationCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Terjadi Masalah Koneksi</h2>
          <p className="text-red-600 mb-8">{dbError}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 mx-auto">
            <HiRefresh className="w-5 h-5" /> Coba Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  // FILTER
  const filteredCourses = initialCourses.filter((course) => {
    const matchCategory = selectedCategory === 'Semua' ? true : course.category?.name === selectedCategory;
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* HEADER & SEARCH */}
        <div className="text-center mb-12 mt-4">
          <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Katalog Kelas</p>
          <h1 className="text-4xl font-extrabold text-[#2e385b] mb-4">Kursus Online Gratis</h1>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <input 
               type="text" 
               placeholder="Cari materi yang ingin kamu pelajari..." 
               className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#2e385b] focus:border-transparent outline-none transition shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SIDEBAR KATEGORI */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
             <h3 className="font-bold text-[#2e385b] mb-4 text-lg">Kategori</h3>
             
             <button 
                onClick={() => setSelectedCategory('Semua')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === 'Semua' ? 'bg-[#2e385b] text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
             >
               Semua Kategori
             </button>

             {categories.map((cat) => (
               <button 
                 key={cat.id}
                 onClick={() => setSelectedCategory(cat.name)}
                 className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
                   selectedCategory === cat.name ? 'bg-[#2e385b] text-white' : 'text-gray-500 hover:bg-gray-50'
                 }`}
               >
                 {cat.name}
               </button>
             ))}
          </div>

          {/* GRID KURSUS*/}
          <div className="flex-1">
             {filteredCourses.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                 <p className="text-gray-500 font-medium">Tidak ada kursus yang ditemukan.</p>
                 <button onClick={() => {setSearchQuery(''); setSelectedCategory('Semua')}} className="mt-2 text-[#2e385b] font-bold hover:underline">Reset Filter</button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredCourses.map((course) => (
                   <CourseCard 
                     key={course.id} 
                     course={course} 
                     user={{ id: userId }} 
                     // REVISI: Ambil status enroll dari data database
                     isEnrolled={course.enrollments?.length > 0} 
                   />
                 ))}
               </div>
             )}
          </div>

        </div>
    </div>
  );
}