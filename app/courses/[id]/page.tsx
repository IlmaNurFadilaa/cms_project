import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/auth';

import Footer from '@/app/component/Footer';
import CourseCardButton from '@/app/component/CourseCardButton'; 
import SyllabusItem from '@/app/component/SyllabusItem';

// IMPORT ICON TAMBAHAN
import { HiDocumentText, HiAcademicCap, HiTag, HiCheckCircle, HiPlay } from 'react-icons/hi';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetail({ params }: PageProps) {
  const { id } = await params;
  const user = await getSessionUser();

  // 1. Ambil Data Kursus Sekaligus Enrollment
  // Kita include enrollments di sini biar efisien (sekali query)
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
      materials: {
        orderBy: { createdAt: 'asc' }, 
      },
      _count: {
        select: { materials: true },
      },
      enrollments: user ? {
        where: { userId: user.id }
      } : false,
    },
  });

  if (!course) notFound();

  // 2. Logic Status: Enrolled & Completed
  const isEnrolled = user && course.enrollments.length > 0;
  let isCompleted = false;

  // 3. Hitung Progress jika sudah Enroll
  if (isEnrolled && user) {
      const totalMaterials = course.materials.length;
      
      if (totalMaterials > 0) {
        // Hitung berapa materi yang sudah status 'isCompleted: true'
        const completedCount = await prisma.userProgress.count({
          where: {
            userId: user.id,
            materialId: { in: course.materials.map(m => m.id) },
            isCompleted: true
          }
        });

        // Jika jumlah materi selesai sama dengan total materi, berarti TAMAT
        if (completedCount === totalMaterials) {
          isCompleted = true;
        }
      }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-[#2e385b]">

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full mt-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-[#2e385b] transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/courses" className="hover:text-[#2e385b] transition">Courses</Link>
          <span className="mx-2">/</span>
          <span className="text-[#2e385b] font-bold">{course.title}</span>
        </nav>

        {/* Header Judul */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
            {course.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* KOLOM KIRI (KONTEN UTAMA) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Hero Image */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-sm border border-gray-100">
               {course.image ? (
                  <Image 
                      src={course.image} 
                      alt={course.title} 
                      fill 
                      className="object-cover hover:scale-105 transition duration-700"
                      priority
                  />
               ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                    No Image Available
                  </div>
               )}
            </div>

            {/* Deskripsi */}
            <section>
              <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                  {course.description}
              </div>
            </section>

            {/* Silabus */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Apa yang akan pelajari (Silabus)</h2>
              
              {course.materials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.materials.map((material, index) => (
                    <SyllabusItem 
                        key={material.id}
                        courseId={course.id}
                        material={material}
                        index={index}
                        isEnrolled={isEnrolled}
                        userId={user?.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-yellow-50 rounded-xl text-yellow-700 text-sm">
                  Materi sedang disiapkan oleh instruktur.
                </div>
              )}
            </section>
            
            {/* Komentar */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Komentar dari Pembelajar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-6 rounded-2xl">
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-200 overflow-hidden">
                         <img src="https://ui-avatars.com/api/?name=Sandhika&background=random" alt="User" />
                      </div>
                      <span className="font-bold text-sm">Sandhika</span>
                   </div>
                   <p className="text-xs text-gray-600 italic leading-relaxed">
                     "Kursus terbaik yang saya pernah ikuti! Materinya fleksibel dan ada versi video yang sangat mudah dipahami."
                   </p>
                </div>
              </div>
            </section>
          </div>

          {/* KOLOM KANAN (SIDEBAR STICKY) */}
          <aside className="lg:col-span-1 h-full">
            <div className="sticky top-28 z-10 bg-gray-100 p-6 rounded-3xl border border-gray-200 shadow-sm">
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-black text-[#2e385b]">GRATIS</span>
                <span className="bg-[#2e385b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Free Access
                </span>
              </div>

              {/* === LOGIC TOMBOL SIDEBAR DIMULAI === */}
              <div className="mb-8">
                 {isEnrolled ? (
                    // 1. JIKA SUDAH DAFTAR
                    <button 
                      disabled={isCompleted} 
                      className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-sm ${
                        isCompleted 
                          // STYLE KURSUS SELESAI (Hijau Pucat + Border Hijau)
                          ? "bg-green-50 text-green-600 border border-green-500 cursor-default" 
                          // STYLE LANJUT BELAJAR (Hijau Solid - Sama seperti di Home)
                          : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5" 
                      }`}
                    >
                       {isCompleted ? (
                         <>
                           <HiCheckCircle className="text-xl" />
                           <span>Kursus Selesai</span>
                         </>
                       ) : (
                         // Arahkan ke halaman belajar / materi pertama
                         <Link href={`/courses/${course.id}/learn`} className="flex items-center gap-2 w-full justify-center">
                            <HiPlay className="text-xl" />
                            <span>Lanjutkan Belajar</span>
                         </Link>
                       )}
                    </button>
                 ) : (
                    // 2. JIKA BELUM DAFTAR (Tombol Default)
                    <CourseCardButton 
                        courseId={course.id} 
                        userId={user?.id} 
                        isEnrolled={isEnrolled} 
                    />
                 )}

                 <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
                    {isEnrolled 
                      ? (isCompleted ? "Selamat! Anda telah menamatkan kursus ini." : "Anda sudah terdaftar. Semangat belajar!") 
                      : "Akses selamanya setelah bergabung"
                    }
                </p>
              </div>
              {/* === LOGIC TOMBOL SELESAI === */}

              {/* Detail List */}
              <div>
                <h4 className="font-bold text-sm mb-4 text-[#2e385b]">Detail Kursus</h4>
                <ul className="space-y-4 text-xs font-medium text-gray-600">
                  <li className="flex items-center gap-3">
                    <HiDocumentText className="text-lg text-gray-400" />
                    <span>Total {course._count.materials} Materi Pembelajaran</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <HiTag className="text-lg text-gray-400" />
                    <span>Kategori : {course.category?.name || 'Umum'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <HiAcademicCap className="text-lg text-gray-400" />
                    <span className="capitalize">Level : {course.level.toLowerCase()}</span>
                  </li>
                </ul>
              </div>

            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
};