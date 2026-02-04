import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import Footer from '@/app/component/Footer';
import { HiPlay, HiBookOpen } from 'react-icons/hi';

export default async function MyLearningPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/auth');
  }

  // QUERY BARU: Ambil Enrollment User
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.id
    },
    include: {
      course: {
        include: {
          category: true,
          _count: { select: { materials: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-[#2e385b]">

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full mt-16">
        
        <div className="text-center mb-12">
           <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Dashboard Siswa</h4>
           <h1 className="text-3xl md:text-4xl font-extrabold text-[#2e385b]">Pembelajaran Saya</h1>
        </div>

        {enrollments.length === 0 ? (
           // TAMPILAN KOSONG
           <div className="bg-gray-50 rounded-[40px] border border-dashed border-gray-300 p-12 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 text-3xl">
                 <HiBookOpen />
              </div>
              <h3 className="text-xl font-bold text-[#2e385b] mb-2">Belum ada kelas yang diikuti</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                 Anda belum mendaftar di kursus apapun saat ini. Mulai perjalanan belajar Anda sekarang!
              </p>
              <Link href="/courses">
                 <button className="px-8 py-3 bg-[#2e385b] text-white rounded-xl font-bold hover:bg-[#1f263e] transition shadow-lg shadow-blue-900/20">
                    Cari Kursus Baru
                 </button>
              </Link>
           </div>
        ) : (
           // TAMPILAN LIST KURSUS
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrollments.map((enrollment) => {
                 const course = enrollment.course;
                 
                 return (
                    <Link key={enrollment.id} href={`/learn/${course.id}`} className="group">
                       <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
                          
                          {/* Gambar */}
                          <div className="relative h-48 bg-gray-100">
                             {course.image ? (
                                <Image 
                                   src={course.image} 
                                   alt={course.title} 
                                   fill 
                                   className="object-cover"
                                />
                             ) : (
                                <div className="flex items-center justify-center h-full text-gray-300 font-bold">No Image</div>
                             )}
                             
                             {/* Badge Kategori */}
                             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#2e385b] shadow-sm uppercase tracking-wide">
                                {course.category?.name}
                             </div>
                          </div>

                          <div className="p-6 flex-1 flex flex-col">
                             <h3 className="font-bold text-lg text-[#2e385b] mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                                {course.title}
                             </h3>
                             
                             <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                <span className="text-xs font-bold text-gray-400">
                                   {course._count.materials} Materi
                                </span>
                                <button className="w-10 h-10 rounded-full bg-[#f0f4ff] text-[#2e385b] flex items-center justify-center group-hover:bg-[#2e385b] group-hover:text-white transition-colors">
                                   <HiPlay className="ml-1" />
                                </button>
                             </div>
                          </div>
                       </div>
                    </Link>
                 );
              })}
           </div>
        )}

      </main>

      <Footer />
    </div>
  );
}