import React from 'react';
import { getSessionUser } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Footer from '@/app/component/Footer';
import Image from 'next/image'; 
import Link from 'next/link';   
import { HiUser, HiMail, HiBadgeCheck, HiShieldCheck } from 'react-icons/hi';

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) redirect('/auth');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-32">
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Profil (Background Warna) */}
          <div className="h-32 bg-[#2e385b]"></div>
          
          <div className="px-8 pb-10">
            {/* Foto Profil */}
            <div className="relative -mt-16 mb-6 flex justify-center md:justify-start">
              <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden bg-gray-200 shadow-lg relative">
                {user.image ? (
                  <Image src={user.image} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#2e385b] text-white text-4xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Info Nama & Role */}
            <div className="text-center md:text-left mb-10">
              <h1 className="text-3xl font-extrabold text-[#2e385b] flex items-center justify-center md:justify-start gap-2">
                {user.name} 
                {user.role === 'ADMIN' && <HiShieldCheck className="text-blue-500" title="Admin" />}
              </h1>
              <p className="text-gray-500 font-medium">{user.role === 'ADMIN' ? 'Administrator System' : 'Siswa MyCourse'}</p>
            </div>

            {/* Detail Informasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2e385b] shadow-sm">
                  <HiMail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-[#2e385b]">{user.email}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2e385b] shadow-sm">
                  <HiBadgeCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Status</p>
                  <p className="text-sm font-bold text-green-600">Verified Member</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/profile/edit">
                    <button className="px-6 py-3 bg-[#2e385b] text-white rounded-xl font-bold text-sm hover:shadow-lg transition active:scale-95">
                        Edit Profil
                    </button>
                </Link>
                <button className="px-6 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition active:scale-95">
                    Ganti Password
                </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}