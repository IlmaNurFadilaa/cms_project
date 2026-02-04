'use client';

import React from 'react';
import Link from 'next/link';
import { updateCourse } from '@/app/actions/admin';
import { Course, Category, Level } from '@prisma/client';

interface EditCourseFormProps {
  course: Course;
  categories: Category[];
}

export default function EditCourseForm({ course, categories }: EditCourseFormProps) {
  return (
    <form action={updateCourse} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
      
      <input type="hidden" name="id" value={course.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Judul Kursus */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold mb-2 ml-1">Judul Kursus</label>
          <input 
            name="title" 
            type="text" 
            defaultValue={course.title} 
            className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none transition"
            required 
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1">Kategori</label>
          <div className="relative">
            <select 
              name="categoryId" 
              defaultValue={course.categoryId} 
              className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] appearance-none focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none cursor-pointer"
              required
            >
              <option value="" disabled>Pilih Kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">▼</span>
          </div>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1">Level</label>
          <div className="relative">
            <select 
              name="level" 
              defaultValue={course.level} 
              className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] appearance-none focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none cursor-pointer"
            >
              {Object.values(Level).map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
            <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">▼</span>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold mb-2 ml-1">Deskripsi</label>
          <textarea 
            name="description" 
            rows={4} 
            defaultValue={course.description} 
            className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none resize-none"
            required
          ></textarea>
        </div>
        

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold mb-2 ml-1">
            Ganti Gambar Sampul <span className="text-gray-400 font-normal">(Opsional)</span>
          </label>
          
          {course.image && (
            <div className="mb-2 text-xs text-gray-500 ml-1">
              File saat ini: <span className="font-medium text-[#2e385b]">{course.image.split('/').pop()}</span>
            </div>
          )}

          <div className="relative border border-gray-200 bg-[#f8fafc] rounded-xl p-2">
            <input 
              name="image" 
              type="file" 
              accept="image/*"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-bold
                file:bg-[#eef2ff] file:text-[#2e385b]
                hover:file:bg-[#e0e7ff]
                cursor-pointer"
            />
          </div>
        </div>

        
        <div className="flex items-center gap-3 ml-2">
           <input 
              type="checkbox" 
              name="isPublished" 
              id="isPublished" 
              defaultChecked={course.isPublished} 
              className="w-5 h-5 accent-[#2e385b] cursor-pointer" 
           />
           <label htmlFor="isPublished" className="font-medium cursor-pointer select-none">Publish Kursus Ini?</label>
        </div>

      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Link href="/admin/courses">
          <button type="button" className="px-8 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition">
            Cancel
          </button>
        </Link>
        <button type="submit" className="px-8 py-3 rounded-xl bg-[#2e385b] text-white font-bold hover:bg-[#1e253d] shadow-lg shadow-blue-900/20 transition">
          Save Changes
        </button>
      </div>
    </form>
  );
}