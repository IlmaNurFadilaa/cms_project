'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/component/Navbar';
import Footer from '@/app/component/Footer';
import { CgSpinner } from 'react-icons/cg';
import { HiCamera, HiUser, HiArrowLeft } from 'react-icons/hi';
import Link from 'next/link';

import { updateProfileAction } from '@/app/actions/profile';

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await updateProfileAction(formData);
      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        router.push('/profile');
        router.refresh(); 
      }
    } catch (error) {
      setErrorMessage("Gagal memperbarui profil.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-32">
        <div className="bg-white w-full max-w-lg p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
                <HiArrowLeft size={24} />
            </Link>
            <div>
                <h1 className="text-2xl font-extrabold text-[#2e385b]">Edit Profil</h1>
                <p className="text-sm text-gray-500 font-medium">Perbarui informasi diri Anda</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-lg">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Foto Profil */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 overflow-hidden">
                        <HiCamera size={32} />
                    </div>
                    <input 
                        type="file" 
                        name="image" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center rounded-3xl transition">
                        <p className="text-[10px] text-white font-bold uppercase">Ganti Foto</p>
                    </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Klik kotak untuk upload foto</p>
            </div>

            {/* Input Nama Lengkap */}
            <div className="space-y-1">
                <label className="block text-sm font-bold ml-1 text-[#2e385b]">Nama Lengkap</label>
                <div className="relative">
                    <input
                        name="name"
                        type="text"
                        placeholder="Masukkan nama baru"
                        required
                        className="w-full p-4 pl-12 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#2e385b] outline-none transition shadow-sm"
                    />
                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            {/* Tombol Simpan */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-[#2e385b] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-[#232b47] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading && <CgSpinner className="animate-spin text-xl" />}
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}