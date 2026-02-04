import React from 'react';
import { prisma } from '../lib/prisma';
import CourseCard from '../component/CourseCard';
import { getSessionUser } from '../lib/auth';
import Footer from '../component/Footer';

export const dynamic = 'force-dynamic'; 

export default async function CoursesPage() {
  const user = await getSessionUser();

  const rawCourses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      enrollments: user ? { where: { userId: user.id } } : false,
      materials: { select: { id: true } }, 
    },
    where: { isPublished: true }
  });

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
       <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full mt-16">
          <h1 className="text-3xl font-extrabold text-[#2e385b] mb-8">All Courses</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                user={user} 
                isEnrolled={user ? course.enrollments.length > 0 : false}
                isCompleted={course.isCompleted} 
              />
            ))}
          </div>
       </div>
       <Footer />
    </div>
  );
}