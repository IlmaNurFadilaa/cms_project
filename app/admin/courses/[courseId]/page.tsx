import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import MaterialRow from '@/app/component/MaterialRow'; 

export default async function CourseDetailPage({ 
  params 
}: { 
  params: Promise<{ courseId: string }> 
}) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      category: true, 
      materials: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!course) return notFound();

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-8 text-[#2e385b]">
    

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Foto Sampul */}
          <div className="w-full md:w-1/3 h-64 md:h-auto relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
            {course.image ? (
              <Image 
                src={course.image} 
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
            )}
          </div>

          {/* Text Info */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-[#2e385b] mb-2">{course.title}</h2>
                <div className="flex gap-2 mb-4">
                   <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                      {course.category.name}
                   </span>
                   <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg capitalize">
                      {course.level.toLowerCase()}
                   </span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold border ${
                course.isPublished 
                ? 'bg-[#e6f6f4] text-[#00a19a] border-[#b5ebe7]' 
                : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {/* SEBELUMNYA: {course.isPublished ? 'Available' : 'Draft'} */}
                {/* SESUDAHNYA: */}
                {course.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>

            <div className="mb-6">
               <h4 className="text-sm font-bold text-gray-400 uppercase mb-1">Deskripsi</h4>
               <p className="text-gray-600 leading-relaxed text-sm">
                  {course.description}
               </p>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Total Materi</p>
                <p className="text-xl font-bold">{course.materials.length} <span className="text-sm font-normal text-gray-500">Video</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Terakhir Update</p>
                <p className="text-xl font-bold">{course.updatedAt.toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABEL MATERI (Bawah) --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Daftar Materi</h3>
          
          {/* Link Tambah Materi (Pastikan folder 'materials/create' ada di dalam [courseId]) */}
          <Link href={`/admin/courses/${courseId}/materials/create`}>
            <button className="bg-[#2e385b] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1e253d] shadow-lg transition text-sm flex items-center gap-2">
              <span>+</span> Tambah Materi
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 w-16">No</th>
                <th className="p-4">Judul Materi</th>
                <th className="p-4">Tipe</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {course.materials.map((material, index) => (
                <MaterialRow 
                  key={material.id} 
                  material={material} 
                  courseId={courseId} 
                  index={index} 
                />
              ))}

              {course.materials.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-12 text-gray-400">
                    Belum ada materi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}