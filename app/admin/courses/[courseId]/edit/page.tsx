import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import EditCourseForm from '@/app/component/EditCourseForm'; 

export default async function EditCoursePage({
  params
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });

  const categories = await prisma.category.findMany();

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#2e385b] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <EditCourseForm course={course} categories={categories} />

      </div>
    </div>
  );
}