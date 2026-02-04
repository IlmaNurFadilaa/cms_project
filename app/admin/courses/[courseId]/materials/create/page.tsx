import MaterialForm from '@/app/component/MaterialForm';
import Link from 'next/link';

export default async function CreateMaterialPage({ 
  params 
}: { 
  params: Promise<{ courseId: string }> 
}) {
  const { courseId } = await params;

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#2e385b] p-8">
      <div className="max-w-3xl mx-auto">

        {/* Form */}
        <MaterialForm courseId={courseId} />

      </div>
    </div>
  );
}