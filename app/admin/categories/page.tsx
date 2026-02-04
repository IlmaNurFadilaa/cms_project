import React from 'react';
import { prisma } from '@/app/lib/prisma';
import CategoryRow from '@/app/component/CategoryRow';
import AddCategoryButton from '@/app/component/AddCategoryButton';

export default async function AdminCategoriesPage() {
  
  const categories = await prisma.category.findMany({
    include: {
        _count: {
            select: { courses: true }
        }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 p-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
             <h2 className="text-xl font-bold text-[#2e385b]">Daftar Kategori</h2>
             <p className="text-sm text-gray-400">Kelola topik pembelajaran yang tersedia.</p>
          </div>
          
          <AddCategoryButton />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 w-16">No</th>
                <th className="p-4">Nama Kategori</th>
                
                <th className="p-4">Total Kursus</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat, index) => (
                <CategoryRow key={cat.id} category={cat} index={index} />
              ))}
              
              {categories.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                        Belum ada kategori. Silakan tambah baru.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}