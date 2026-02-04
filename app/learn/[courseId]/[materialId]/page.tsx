import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/auth';

// Components
import CompleteButton from '@/app/component/CompleteButton'; 

import { HiChevronLeft, HiChevronRight, HiPlay, HiMenuAlt3 } from 'react-icons/hi';

interface PageProps {
  params: Promise<{ courseId: string; materialId: string }>;
}

export default async function LearningPlayerPage({ params }: PageProps) {
  const { courseId, materialId } = await params;
  const user = await getSessionUser();

  // 1. Cek Login
  if (!user) redirect('/auth');

  // 2. PROTEKSI HALAMAN (SECURITY CHECK)
  // Cek apakah user sudah terdaftar di kursus ini
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: courseId
      }
    }
  });

  // JIKA BELUM DAFTAR -> TENDANG KEMBALI KE HALAMAN DETAIL KURSUS
  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  // 3. Ambil Progress & Status Materi Ini
  const progress = await prisma.userProgress.findUnique({
    where: { userId_materialId: { userId: user.id, materialId: materialId } },
  });
  const isCompleted = progress?.isCompleted || false;

  // 4. Hitung Statistik Progress
  const completedCount = await prisma.userProgress.count({
    where: {
      userId: user.id,
      isCompleted: true,
      material: { courseId: courseId }
    }
  });

  // 5. Ambil Data Kursus & Materi
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      materials: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!course) notFound();

  const currentIndex = course.materials.findIndex((m) => m.id === materialId);
  const currentMaterial = course.materials[currentIndex];

  if (!currentMaterial) notFound();

  // Logic Next/Prev Button
  const prevMaterial = currentIndex > 0 ? course.materials[currentIndex - 1] : null;
  const nextMaterial = currentIndex < course.materials.length - 1 ? course.materials[currentIndex + 1] : null;

  const totalMaterials = course.materials.length;
  const progressPercent = totalMaterials > 0 ? Math.round((completedCount / totalMaterials) * 100) : 0;

  const getYoutubeEmbed = (url: string) => {
    if (url.includes('youtu.be')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
    return url.replace('watch?v=', 'embed/');
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-[#2e385b]">

      <main className="flex-1 max-w-[1400px] mx-auto px-4 md:px-6 py-6 w-full mt-16">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-hidden whitespace-nowrap">
            <Link href="/courses" className="hover:text-[#2e385b]">Courses</Link>
            <span>/</span>
            <Link href={`/courses/${courseId}`} className="hover:text-[#2e385b] font-medium">{course.title}</Link>
            <span>/</span>
            <span className="text-[#2e385b] font-bold truncate">{currentMaterial.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* === KIRI: KONTEN UTAMA (Video + Deskripsi + Navigasi) === */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* VIDEO PLAYER */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video relative border border-gray-800 z-10">
              {currentMaterial.videoType === 'YOUTUBE' ? (
                  <iframe 
                    src={getYoutubeEmbed(currentMaterial.videoUrl)} 
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentMaterial.title}
                  />
              ) : (
                  <video 
                    src={currentMaterial.videoUrl} 
                    controls 
                    className="w-full h-full"
                    controlsList="nodownload"
                  >
                    Browser Anda tidak mendukung tag video.
                  </video>
              )}
            </div>

            {/* JUDUL MATERI */}
            <div className="border-b border-gray-100 pb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#2e385b] leading-tight mb-2">
                    {currentMaterial.title}
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                    Materi ke-{currentIndex + 1} dari {totalMaterials}
                </p>
            </div>

            {/* DESKRIPSI */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#2e385b] mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                   <span className="w-1 h-4 bg-[#2e385b] rounded-full"></span>
                   Tentang Materi Ini
                </h3>
                <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-base">
                    {currentMaterial.description || "Tidak ada deskripsi tambahan untuk materi ini."}
                </div>
            </div>

            {/* NAVIGASI & TOMBOL SELESAI */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
                
                {/* Previous */}
                <Link 
                  href={prevMaterial ? `/learn/${courseId}/${prevMaterial.id}` : '#'}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition w-full md:w-auto justify-center ${
                      prevMaterial 
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                    <HiChevronLeft className="text-lg" /> Sebelumnya
                </Link>

                {/* Selesai Button */}
                <div className="flex-1 w-full md:w-auto flex justify-center">
                    <CompleteButton 
                      materialId={materialId} 
                      initialCompleted={isCompleted} 
                    />
                </div>

                {/* Next */}
                <Link 
                  href={nextMaterial ? `/learn/${courseId}/${nextMaterial.id}` : '#'}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition w-full md:w-auto justify-center flex-row-reverse ${
                      nextMaterial
                      ? 'bg-[#2e385b] text-white hover:bg-[#1f263e] shadow-lg shadow-blue-900/20'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                    <HiChevronRight className="text-lg" /> Selanjutnya
                </Link>
            </div>
          </div>

          {/* === KANAN: SIDEBAR PLAYLIST === */}
          <aside className="lg:col-span-4">
             <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden sticky top-24 flex flex-col max-h-[calc(100vh-120px)]">
                
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="font-extrabold text-[#2e385b] text-lg">Daftar Materi</h3>
                      <div className="bg-white p-2 rounded-lg border border-gray-200 text-gray-400">
                         <HiMenuAlt3 className="text-xl" />
                      </div>
                   </div>
                   
                   <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                      <div 
                         className="bg-green-500 h-full transition-all duration-1000 ease-out rounded-full" 
                         style={{ width: `${progressPercent}%` }}
                      ></div>
                   </div>
                   
                   <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <span>{completedCount}/{totalMaterials} Selesai</span>
                      <span className="text-green-600">{progressPercent}%</span>
                   </div>
                </div>

                <div className="overflow-y-auto p-3 space-y-2 flex-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                   {course.materials.map((m, idx) => {
                      const isActive = m.id === materialId;
                      return (
                        <Link key={m.id} href={`/learn/${courseId}/${m.id}`}>
                           <div className={`p-4 rounded-2xl flex gap-4 transition-all duration-200 cursor-pointer group ${
                              isActive 
                                ? 'bg-[#eef4ff] border border-blue-100 shadow-sm' 
                                : 'hover:bg-gray-50 border border-transparent'
                           }`}>
                              <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                                 isActive 
                                    ? 'bg-[#2e385b] text-white shadow-lg shadow-blue-900/20' 
                                    : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-md group-hover:text-[#2e385b]'
                              }`}>
                                 {isActive ? <HiPlay /> : idx + 1}
                              </div>
                              
                              <div className="flex-1 py-0.5">
                                 <h4 className={`text-sm font-bold leading-snug line-clamp-2 mb-1 ${
                                    isActive ? 'text-[#2e385b]' : 'text-gray-500 group-hover:text-gray-800'
                                 }`}>
                                    {m.title}
                                 </h4>
                                 <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                    {m.videoType}
                                 </p>
                              </div>
                           </div>
                        </Link>
                      );
                   })}
                </div>
             </div>
          </aside>
        </div>
      </main>
    </div>
  );
}