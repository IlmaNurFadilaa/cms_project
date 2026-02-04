'use client';

import React, { useState, useEffect, useActionState } from 'react'; // 1. Import dari 'react'
import { HiPlus, HiX } from 'react-icons/hi';
import { useFormStatus } from 'react-dom'; 
import { createCategory } from '@/app/actions/categories';

// Komponen Tombol Submit
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#2e385b] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#1f263e] shadow-lg hover:shadow-xl transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? 'Menyimpan...' : 'Simpan Kategori'}
    </button>
  );
}

export default function AddCategoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 2. Ganti useFormState menjadi useActionState
  // Struktur return-nya: [state, formAction, isPending]
  const [state, formAction] = useActionState(createCategory, null);

  // Efek untuk menutup modal jika berhasil disimpan
  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state?.success]);

  return (
    <>
      {/* Tombol Utama */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#2e385b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1e253d] shadow-lg transition flex items-center gap-2"
      >
        <HiPlus className="text-lg" /> Tambah Kategori
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
            
            <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
            >
                <HiX size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#2e385b]">Buat Kategori Baru</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Masukkan nama untuk kategori yang akan dibuat.
              </p>
            </div>

            {/* Pesan Error */}
            {state?.success === false && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">
                    {state.message}
                </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-[#2e385b]">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Contoh: Digital Marketing"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2e385b] focus:border-transparent transition text-[#2e385b] font-medium"
                />
              </div>

              <div className="pt-2">
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}