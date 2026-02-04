'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { HiPencil } from 'react-icons/hi';
import AdminDeleteButton from './AdminDeleteButton'; 
import { deleteCourse } from '@/app/actions/admin'; 

interface CourseRowProps {
  course: any; 
}

export default function CourseRow({ course }: CourseRowProps) {
  const router = useRouter(); 

  const handleRowClick = () => {
    router.push(`/admin/courses/${course.id}`);
  };

  return (
    <tr 
      onClick={handleRowClick}
      className="hover:bg-blue-50/50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer group" 
    >

      <td className="p-4">
        <div className="font-bold text-[#2e385b]">{course.title}</div>
        <div className="text-[10px] text-gray-400 font-medium">ID: {course.id}</div>
      </td>

      <td className="p-4">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
          {course.category?.name || 'Umum'}
        </span>
      </td>

      <td className="p-4 text-gray-500 font-medium text-sm">
        {course._count.materials} Materi
      </td>
      
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
          course.isPublished ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
        }`}>
          {course.isPublished ? 'Published' : 'Draft'}
        </span>
      </td>
      
      <td className="p-4 text-right">
        
        <div 
          className="flex items-center justify-end gap-2" 
          onClick={(e) => e.stopPropagation()} 
        >
          {/* EDIT */}
          <Link href={`/admin/courses/${course.id}/edit`}>
            <button className="p-2 text-gray-400 hover:text-[#2e385b] hover:bg-gray-100 rounded-lg transition-all" title="Edit Kursus">
              <HiPencil size={20} />
            </button>
          </Link>

          {/* HAPUS */}
          <AdminDeleteButton 
            id={course.id} 
            title={course.title} 
            typeLabel="Kursus" 
            onDelete={deleteCourse} 
          />
        </div>
      </td>
    </tr>
  );
}