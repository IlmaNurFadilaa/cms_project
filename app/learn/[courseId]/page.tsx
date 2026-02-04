import { redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/auth';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function LearnRedirectPage({ params }: PageProps) {
  const { courseId } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect('/auth');
  }

  const firstMaterial = await prisma.material.findFirst({
    where: { courseId },
    orderBy: { createdAt: 'asc' }, 
  });

  if (!firstMaterial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#2e385b]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Kelas Belum Siap</h1>
          <p className="text-gray-500">Instruktur belum mengunggah materi untuk kursus ini.</p>
          <a href="/courses" className="mt-4 inline-block text-blue-600 hover:underline">Kembali ke Katalog</a>
        </div>
      </div>
    );
  }

  redirect(`/learn/${courseId}/${firstMaterial.id}`);
}