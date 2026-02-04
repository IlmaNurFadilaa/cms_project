'use client';

import React from 'react';
import { Category } from '@prisma/client';
// Hapus import HiTag karena tidak dipakai lagi
import GenericDeleteButton from '@/app/component/AdminDeleteButton';
import { deleteCategory } from '@/app/actions/categories';

interface Props {
  category: Category & {
    _count: { courses: number };
  };
  index: number;
}

export default function CategoryRow({ category, index }: Props) {
  
  const handleDeleteWrapper = async (id: string) => {
    const result = await deleteCategory(id);
    return { 
        success: result.success, 
        error: result.message 
    };
  };

  return (
    <tr className="group hover:bg-[#f0f7ff] transition border-b border-gray-50 last:border-none">
      
      {/* NO */}
      <td className="p-4 w-16 text-gray-400 font-bold text-sm">
         #{index + 1}
      </td>

      {/* NAMA KATEGORI (Ikon Dihapus) */}
      <td className="p-4">
         {/* Div pembungkus ikon dihapus, langsung tampilkan nama */}
         <span className="font-bold text-[#2e385b] text-lg">
            {category.name}
         </span>
      </td>

      {/* JUMLAH KURSUS (Badge) */}
      <td className="p-4">
         <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            category._count.courses > 0
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-gray-100 text-gray-400 border-gray-200'
         }`}>
            {category._count.courses} Kursus
         </span>
      </td>

      {/* AKSI */}
      <td className="p-4 text-right">
         <div className="flex items-center justify-end">
            <GenericDeleteButton 
               id={category.id}
               title={category.name}
               typeLabel="Kategori"
               onDelete={handleDeleteWrapper}
            />
         </div>
      </td>
    </tr>
  );
}