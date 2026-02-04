import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { HiPencil, HiCalendar, HiVideoCamera, HiTrash } from 'react-icons/hi';
import AdminDeleteButton from '@/app/component/AdminDeleteButton';
import { deleteMaterial } from '@/app/actions/admin'; 

interface PageProps {
  params: Promise<{ courseId: string; materialId: string }>;
}

export default async function AdminMaterialDetail({ params }: PageProps) {

  const { courseId, materialId } = await params;

  const material = await prisma.material.findFirst({
    where: { 
      id: materialId,
      courseId: courseId 
    },
    include: {
      course: {
        select: { title: true }
      }
    }
  });

  if (!material) notFound();

  const getYoutubeEmbed = (url: string) => {
    if (url.includes('youtu.be')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
    return url.replace('watch?v=', 'embed/');
  };

  // Wrapper Server Action untuk Delete
  async function handleDeleteAction(id: string) {
    'use server';
    const result = await deleteMaterial(id);
    
    // Jika sukses, redirect ke halaman list materi
    if (result.success) {
       redirect(`/admin/courses/${courseId}`);
    }
    return result;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* --- HEADER & BREADCRUMB --- */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
            <Link href="/admin/courses" className="hover:text-[#2e385b]">Courses</Link>
            <span>/</span>
            <Link href={`/admin/courses/${courseId}`} className="hover:text-[#2e385b] line-clamp-1 max-w-[200px]">
              {material.course.title}
            </Link>
            <span>/</span>
            <span className="text-[#2e385b]">Detail Materi</span>
        </div>

        <h1 className="text-3xl font-extrabold text-[#2e385b]">{material.title}</h1>
      </div>

      {/* --- CONTENT UTAMA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* KOLOM KIRI: VIDEO PLAYER & DESKRIPSI (Lebar 8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Video Player */}
            <div className="bg-black rounded-[32px] overflow-hidden shadow-xl aspect-video relative border border-gray-800 z-10">
              {material.videoType === 'YOUTUBE' ? (
                  <iframe 
                    src={getYoutubeEmbed(material.videoUrl)} 
                    className="w-full h-full"
                    allowFullScreen
                    title={material.title}
                  />
              ) : (
                  <video 
                    src={material.videoUrl} 
                    controls 
                    className="w-full h-full"
                  >
                    Browser Anda tidak mendukung tag video.
                  </video>
              )}
            </div>

            {/* Deskripsi Materi */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                 <span className="w-8 h-1 bg-[#2e385b] rounded-full"></span>
                 Deskripsi Materi
              </h3>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                  {material.description || <em className="text-gray-400">Tidak ada deskripsi tambahan.</em>}
              </div>
            </div>
        </div>

        {/* KOLOM KANAN: INFO & ACTIONS (Lebar 4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-8">
            
            {/* Card Info */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-6">Informasi File</h3>
              
              <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                         <HiVideoCamera size={24} />
                     </div>
                     <div>
                         <p className="text-xs text-gray-400 font-bold uppercase mb-1">Tipe Video</p>
                         <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
                            {material.videoType}
                         </span>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                         <HiCalendar size={24} />
                     </div>
                     <div>
                         <p className="text-xs text-gray-400 font-bold uppercase mb-1">Dibuat Pada</p>
                         <p className="text-sm font-bold text-[#2e385b]">
                            {new Date(material.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })}
                         </p>
                     </div>
                  </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-6">Aksi</h3>
              
              <div className="flex flex-col gap-3">
                  {/* Tombol Edit */}
                  <Link href={`/admin/courses/${courseId}/materials/${materialId}/edit`} className="w-full">
                     <button className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#f0f7ff] text-[#2e385b] font-bold hover:bg-[#2e385b] hover:text-white transition-all duration-300 group shadow-sm border border-blue-100">
                        <HiPencil size={20} className="group-hover:scale-110 transition-transform" /> 
                        Edit Materi
                     </button>
                  </Link>

                  {/* Tombol Hapus */}
                  <div className="w-full">
                      <AdminDeleteButton 
                        id={material.id} 
                        title={material.title} 
                        typeLabel="Materi" 
                        onDelete={handleDeleteAction}
                        
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-all duration-300 group shadow-sm border border-red-100"
                      >
                         {/* DI SINI KITA ISI KONTEN CUSTOM */}
                         <HiTrash size={20} className="group-hover:scale-110 transition-transform" /> 
                         Hapus Materi
                      </AdminDeleteButton>
                  </div>
              </div>
            </div>

        </div>

      </div>
    </div>
  );
}