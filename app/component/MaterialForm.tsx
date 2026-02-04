'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createMaterial, updateMaterial } from '@/app/actions/admin';
import { Material, VideoType } from '@prisma/client'; 

interface MaterialFormProps {
  courseId: string;
  initialData?: Material;
}

export default function MaterialForm({ courseId, initialData }: MaterialFormProps) {
  const isEdit = !!initialData;
  const action = isEdit ? updateMaterial : createMaterial;

  const detectType = () => {
    if (initialData?.videoUrl?.startsWith('/uploads')) {
      return "UPLOAD" as VideoType; 
    }
    return initialData?.videoType || "YOUTUBE" as VideoType;
  };

  const [videoType, setVideoType] = useState<VideoType>(detectType());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("⚠️ File terlalu besar! Maksimal 500MB.");
        e.target.value = "";
      }
    }
  };

  return (
    <form action={action} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
      
      <input type="hidden" name="courseId" value={courseId} />
      {isEdit && <input type="hidden" name="id" value={initialData.id} />}

      <div className="grid grid-cols-1 gap-6">
        
        {/* Judul Materi */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1">Judul Materi</label>
          <input 
            name="title" 
            type="text" 
            defaultValue={initialData?.title}
            placeholder="Contoh: Pengenalan Next.js"
            className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none transition"
            required 
          />
        </div>

        {/* LOGIKA DINAMIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Dropdown Tipe Video */}
          <div>
            <label className="block text-sm font-bold mb-2 ml-1">Tipe Video</label>
            <div className="relative">
              <select 
                name="videoType" 
                value={videoType}
                onChange={(e) => setVideoType(e.target.value as VideoType)}
                className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] appearance-none focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none cursor-pointer"
              >
                <option value="YOUTUBE">YouTube</option>
                <option value="UPLOAD">Assets (Upload)</option>
              </select>
              <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">▼</span>
            </div>
          </div>
          
          <div className="md:col-span-2">
            
            {/* === YOUTUBE === */}
            {(videoType as string) === 'YOUTUBE' ? (
              <>
                <label className="block text-sm font-bold mb-2 ml-1">Link Video YouTube</label>
                <input 
                  name="videoUrl" 
                  type="text" 
                  defaultValue={!initialData?.videoUrl.startsWith('/uploads') ? initialData?.videoUrl : ''}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none transition"
                  required 
                />
              </>
            ) : (
              
              <>
                <label className="block text-sm font-bold mb-2 ml-1">
                  Upload Video (MP4)
                  {isEdit && <span className="text-gray-400 font-normal ml-1 text-xs">(Opsional saat Edit)</span>}
                </label>
                
                {isEdit && initialData?.videoUrl.startsWith('/uploads') && (
                   <div className="flex items-center gap-3 mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="bg-white p-2 rounded text-xl border border-blue-100">📺</div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-0.5">Video Saat Ini</p>
                        <p className="text-sm text-blue-700 font-bold truncate max-w-[250px]">
                           {initialData?.videoUrl.split('/').pop()}
                        </p>
                      </div>
                   </div>
                )}


                <div className="relative border border-gray-200 bg-[#f8fafc] rounded-xl p-2">
                  <input 
                    name="videoFile" 
                    type="file" 
                    accept="video/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-bold
                      file:bg-[#eef2ff] file:text-[#2e385b]
                      hover:file:bg-[#e0e7ff]
                      cursor-pointer"
                    required={!isEdit} 
                  />
                </div>
                {isEdit && <p className="text-xs text-gray-400 mt-2 ml-1">*Upload file baru untuk mengganti video lama.</p>}
              </>
            )}
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1">Deskripsi</label>
          <textarea 
            name="description" 
            rows={3} 
            defaultValue={initialData?.description || ''}
            placeholder="Jelaskan sedikit tentang materi ini..."
            className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none resize-none"
          ></textarea>
        </div>

      </div>

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Link href={`/admin/courses/${courseId}`}>
          <button type="button" className="px-8 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition">
            Batal
          </button>
        </Link>
        <button type="submit" className="px-8 py-3 rounded-xl bg-[#2e385b] text-white font-bold hover:bg-[#1e253d] shadow-lg shadow-blue-900/20 transition">
          {isEdit ? 'Simpan Perubahan' : 'Tambah Materi'}
        </button>
      </div>
    </form>
  );
}