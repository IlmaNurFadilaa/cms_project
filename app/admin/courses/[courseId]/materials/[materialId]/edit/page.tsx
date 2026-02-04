import { prisma } from '@/app/lib/prisma';
import MaterialForm from '@/app/component/MaterialForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditMaterialPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; materialId: string }> 
}) {
  const { courseId, materialId } = await params;

  const material = await prisma.material.findUnique({
    where: { id: materialId }
  });

  if (!material) return notFound();

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#2e385b] p-8">
      <div className="max-w-3xl mx-auto">

        <MaterialForm courseId={courseId} initialData={material} />

      </div>
    </div>
  );
}