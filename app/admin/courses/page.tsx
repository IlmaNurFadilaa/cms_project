import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import Search from '@/app/component/Search';
import CourseRow from '@/app/component/CourseRow'; 

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>; 
}) {
  const params = await searchParams;
  const query = params.query || ''; 

  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { category: { name: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: {
      category: true,
      _count: {
        select: { materials: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <Search placeholder="Cari judul kursus..." />
          <Link href="/admin/courses/create">
            <button className="bg-[#2e385b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1e253d] shadow-lg transition">
              + Tambah Kursus
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Judul Kursus</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Jumlah Materi</th>
                <th className="p-4">Status</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}

              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-12 text-gray-400">
                    Tidak ditemukan data.
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