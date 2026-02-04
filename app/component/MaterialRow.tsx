'use client';

import React from 'react';
import Link from 'next/link';
import { HiPencil } from 'react-icons/hi';
import GenericDeleteButton from '@/app/component/AdminDeleteButton'; 
import { deleteMaterial } from '@/app/actions/admin'; 

// Update Interface: Kita pakai 'any' untuk videoType agar tidak error garis merah
interface MaterialRowProps {
  material: {
    id: string;
    title: string;
    videoType: any; // Menggunakan 'any' agar Enum Prisma tidak dianggap error
  };
  courseId: string;
  index: number;
}

export default function MaterialRow({ material, courseId, index }: MaterialRowProps) {

  // URL detail preview (admin view)
  const detailUrl = `/admin/courses/${courseId}/materials/${material.id}`;

  const handleDeleteWrapper = async (id: string) => {
    const result = await deleteMaterial(id); 
    return {
      success: result.success,
      error: result.message
    };
  };

  return (
    <tr className="group hover:bg-[#f0f7ff] transition border-b border-gray-50 last:border-none">
      
      {/* Kolom No */}
      <td className="p-4 text-gray-400 font-medium w-16 align-middle">
        #{index + 1}
      </td>

      {/* Kolom Judul (DESKRIPSI SUDAH DIHAPUS) */}
      <td className="p-4 align-middle">
        <div className="flex flex-col">
          <Link href={detailUrl} className="font-bold text-[#2e385b] hover:text-blue-600 hover:underline transition w-fit">
            {material.title}
          </Link>
          {/* Bagian deskripsi di sini sudah dihapus */}
        </div>
      </td>

      {/* Kolom Tipe */}
      <td className="p-4 align-middle">
        <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wide ${
          material.videoType === 'YOUTUBE' 
            ? 'bg-red-50 text-red-600 border-red-100' 
            : 'bg-blue-50 text-blue-600 border-blue-100'
        }`}>
          {/* String() memastikan enum terender sebagai teks biasa */}
          {String(material.videoType)}
        </span>
      </td>

      {/* Kolom Aksi */}
      <td className="p-4 text-right align-middle">
        <div className="flex items-center justify-end gap-2">
           <Link 
             href={`/admin/courses/${courseId}/materials/${material.id}/edit`} 
             className="text-gray-400 hover:text-blue-600 p-2 rounded-lg transition hover:bg-blue-50"
             title="Edit Materi"
           >
             <HiPencil size={20} />
           </Link>

           <GenericDeleteButton 
             id={material.id}
             title={material.title}
             typeLabel="Materi"
             onDelete={handleDeleteWrapper}
           />
        </div>
      </td>
    </tr>
  );
}