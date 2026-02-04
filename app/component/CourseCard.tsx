'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiPhotograph, HiCheckCircle, HiPlay } from 'react-icons/hi';
import CourseCardButton from './CourseCardButton';

interface Props {
  course: any;
  user?: any;
  isEnrolled: boolean;
  isCompleted?: boolean; 
}

export default function CourseCard({ course, user, isEnrolled, isCompleted = false }: Props) {
  const safeUserId = user && user.id ? user.id : undefined;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
      
      {/* Thumbnail */}
      <Link href={`/courses/${course.id}`}>
        <div className="relative h-56 bg-gray-200 overflow-hidden">
          {course.image ? (
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
              <HiPhotograph className="text-4xl mb-2 opacity-50" />
              <span className="text-xs font-bold">No Image</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
            <p className="text-[10px] font-extrabold text-[#2e385b] uppercase tracking-wider">
              {course.level}
            </p>
          </div>
        </div>
      </Link>

      {/* Konten */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 uppercase tracking-wider">
            {course.category?.name || 'UMUM'}
          </span>
        </div>

        <Link href={`/courses/${course.id}`} className="block mb-4">
          <h3 className="font-extrabold text-[#2e385b] text-xl leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4">
          
          {isEnrolled ? (
             <Link href={`/courses/${course.id}`}>
                <button className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                  isCompleted 
                    // 'SELESAI' : Hijau Pucat + Border Hijau 
                    ? "bg-green-50 text-green-600 border border-green-500 cursor-default" 
                    // 'LANJUT' : Hijau Solid
                    : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg shadow-green-200" 
                }`}>
                   {isCompleted ? (
                     <>
                       <HiCheckCircle className="text-xl" />
                       <span>Kursus Selesai</span>
                     </>
                   ) : (
                     <>
                       <HiPlay className="text-xl" />
                       <span>Lanjutkan Belajar</span>
                     </>
                   )}
                </button>
             </Link>
          ) : (
            <CourseCardButton 
              courseId={course.id} 
              userId={safeUserId} 
              isEnrolled={isEnrolled} 
            />
          )}
        </div>
      </div>
    </div>
  );
}