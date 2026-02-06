import React from 'react';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/auth';
import CourseCatalog from '@/app/component/CourseCatalog'; // Pastikan path import ini benar
import Footer from '@/app/component/Footer';

export const dynamic = 'force-dynamic'; 

export default async function CoursesPage() {
  const user = await getSessionUser();

  // 1. Ambil Data Kategori untuk Sidebar
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  // 2. Ambil Data Kursus
  const rawCourses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      enrollments: user ? { where: { userId: user.id } } : false,
      materials: { select: { id: true } }, 
    },
    where: { isPublished: true }
  });

  // 3. Hitung logika 'isCompleted' di server biar cepat
  const courses = await Promise.all(rawCourses.map(async (course) => {
    let isCompleted = false;
    if (user && course.enrollments.length > 0) {
      const totalMaterials = course.materials.length;
      if (totalMaterials > 0) {
         const completedCount = await prisma.userProgress.count({
           where: {
             userId: user.id,
             materialId: { in: course.materials.map(m => m.id) },
             isCompleted: true
           }
         });
         if (completedCount === totalMaterials) isCompleted = true;
      }
    }
    return { ...course, isCompleted };
  }));

  return (
    <div className="bg-white min-h-screen flex flex-col">
       {/* Kita oper data ke Client Component untuk urusan layout & search */}
       <CourseCatalog 
          initialCourses={courses} 
          categories={categories} 
          userId={user?.id} 
       />
       <Footer />
    </div>
  );
}