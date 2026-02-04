'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { enrollCourse } from '@/app/actions/enrollment'; 
import { HiCheckCircle, HiExclamation } from 'react-icons/hi';

interface Props {
  courseId: string;
  userId?: string | null; // Update tipe data agar lebih jelas
  isEnrolled: boolean;
}

export default function CourseCardButton({ courseId, userId, isEnrolled }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- LOGIC FIX: Validasi ketat User ID ---
  // Kita pastikan userId benar-benar valid (bukan string kosong, bukan string 'undefined', bukan null)
  const isValidUser = userId && userId !== 'undefined' && userId !== 'null' && userId.trim() !== '';

  // 1. GUEST: Jika user tidak valid -> Paksa tombol Login
  if (!isValidUser) {
    return (
      <Link 
        href={`/auth?callbackUrl=/courses/${courseId}`} 
        className="block w-full"
      >
        <button className="w-full bg-[#2e385b] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1f263e] transition shadow-lg shadow-blue-900/20">
          Masuk untuk Mengikuti
        </button>
      </Link>
    );
  }

  // 2. MEMBER: Jika user valid DAN sudah enroll -> Tombol Lanjut Belajar
  if (isEnrolled) {
    return (
      <Link href={`/learn/${courseId}`} className="block w-full">
        <button className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
           <HiCheckCircle className="text-2xl" /> Lanjut Belajar
        </button>
      </Link>
    );
  }

  // 3. MEMBER: Jika user valid TAPI belum enroll -> Tombol Daftar (Enroll)
  const handleEnroll = () => {
    startTransition(async () => {
      // Pastikan userId dikirim sebagai string yang aman
      const safeUserId = userId || '';
      const result = await enrollCourse(courseId, safeUserId);
      
      if (result.success) {
        setIsOpen(false);
        router.push(`/learn/${courseId}`);
      } else {
        alert(result.message || 'Gagal mendaftar');
      }
    });
  };

  const Modal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2e385b]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
        <div className="w-16 h-16 bg-blue-50 text-[#2e385b] rounded-full flex items-center justify-center mx-auto mb-6">
          <HiExclamation size={32} />
        </div>
        <h3 className="text-xl font-bold text-[#2e385b] text-center mb-2">Mulai Belajar?</h3>
        <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
          Apakah Anda yakin ingin mendaftar di kelas ini? Progress belajar Anda akan tersimpan otomatis.
        </p>
        <div className="flex gap-3">
          <button
            disabled={isPending}
            onClick={() => setIsOpen(false)}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition active:scale-95 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            disabled={isPending}
            onClick={handleEnroll}
            className="flex-1 py-3 rounded-xl bg-[#2e385b] text-white font-bold hover:bg-[#1f263e] shadow-lg shadow-blue-900/20 transition active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isPending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Ya, Gabung Kelas'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#2e385b] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1f263e] transition shadow-lg shadow-blue-900/20"
      >
        Ikuti Kelas Ini
      </button>
      {isOpen && mounted && createPortal(<Modal />, document.body)}
    </>
  );
}