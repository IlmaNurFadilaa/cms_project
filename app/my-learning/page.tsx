import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/auth';
import Footer from '@/app/component/Footer';
import { HiCheckCircle, HiBookOpen } from 'react-icons/hi'; 

export default async function MyLearningPage() {
  const user = await getSessionUser();
  if (!user) redirect('/auth');

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          category: true, 
          materials: {
            select: { id: true } 
          },
          _count: { select: { materials: true } }
        }
      }
    }
  });

  const progressData = await prisma.userProgress.findMany({
    where: { userId: user.id, isCompleted: true },
    select: { materialId: true }
  });
  
  const completedMaterialIds = new Set(progressData.map(p => p.materialId));

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-[#2e385b]">
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full mt-16">
        
        {/* === HEADER STYLE CATALOG (CENTERED) === */}
        <div className="text-center mb-12 mt-4">
          <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
            Dashboard Siswa
          </p>
          <h1 className="text-4xl font-extrabold text-[#2e385b] mb-4">
            Pembelajaran Saya
          </h1>
        </div>

        {enrollments.length === 0 ? (
           <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
             <div className="w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiBookOpen className="text-3xl" />
             </div>
             <h3 className="text-lg font-bold text-[#2e385b] mb-2">Belum ada kelas yang diikuti</h3>
             <p className="text-gray-500 mb-6 text-sm">Anda belum mendaftar di kursus apapun saat ini.</p>
             <Link href="/courses" className="px-8 py-3 bg-[#2e385b] text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Cari Kursus Baru
             </Link>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {enrollments.map((enroll) => {
                const course = enroll.course;
                const totalMaterials = course._count.materials || 0;
                const completedCount = course.materials.filter(m => completedMaterialIds.has(m.id)).length;
                
                const percentage = totalMaterials > 0 ? Math.round((completedCount / totalMaterials) * 100) : 0;
                const isFinished = percentage === 100 && totalMaterials > 0;

                return (
                  <div key={course.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                     
                     {/* Gambar */}
                     <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {course.image ? (
                           <Image 
                             src={course.image} 
                             alt={course.title} 
                             fill 
                             className="object-cover transition-transform duration-700 group-hover:scale-105" 
                           />
                        ) : (
                           <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">No Image</div>
                        )}
                        {/* Overlay Kategori */}
                        <div className="absolute top-4 left-4">
                           <span className="bg-white/90 backdrop-blur-sm text-[#2e385b] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                              {course.category?.name || 'Umum'}
                           </span>
                        </div>
                     </div>

                     <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-extrabold text-xl text-[#2e385b] leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {course.title}
                        </h3>
                        
                        {/* Progress Bar */}
                        <div className="mt-auto pt-4 border-t border-gray-50">
                           <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                              <span className={isFinished ? "text-green-600" : "text-blue-600"}>{percentage}% Selesai</span>
                              <span>{completedCount}/{totalMaterials} Materi</span>
                           </div>
                           
                           <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-6">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isFinished ? 'bg-green-500' : 'bg-blue-600'}`} 
                                style={{ width: `${percentage}%` }}
                              ></div>
                           </div>

                           <div>
                              {isFinished ? (
                                 <button className="w-full py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-default">
                                    <HiCheckCircle className="text-xl" /> Kursus Selesai
                                 </button>
                              ) : (
                                 <Link href={`/learn/${course.id}`} className="block w-full">
                                 <button className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition shadow-lg shadow-green-500/20">
                                    <HiCheckCircle className="text-xl" /> Lanjutkan Belajar
                                 </button>
                                 </Link>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                );
             })}
           </div>
        )}
      </main>

      <Footer />
    </div>
  );
}