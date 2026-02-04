import { prisma } from '@/app/lib/prisma';
import UserForm from '@/app/component/UserForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditUserPage({ 
  params 
}: { 
  params: Promise<{ userId: string }> 
}) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) return notFound();

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#2e385b] p-8">
      <div className="max-w-3xl mx-auto">
        <UserForm initialData={user} />
      </div>
    </div>
  );
}