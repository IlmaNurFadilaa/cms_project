import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/app/lib/auth';
import Sidebar from '@/app/component/Sidebar';
import AdminHeader from '@/app/component/AdminHeader'; 

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth');
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] font-poppins text-[#2e385b]">
      <Sidebar />

      {/* KONTEN KANAN */}
      <div className="flex-1 ml-64 p-8 transition-all duration-300">
        
        <AdminHeader />

        {children}
        
      </div>
    </div>
  );
}