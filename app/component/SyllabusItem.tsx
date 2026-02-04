'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { enrollCourse } from '@/app/actions/enrollment'; 
import { HiExclamation, HiPlay, HiLockClosed } from 'react-icons/hi';

interface Props {
  courseId: string;
  material: {
    id: string;
    title: string;
    videoType: string;
    description: string | null;
  };
  index: number;
  isEnrolled: boolean;
  userId?: string;
}

export default function SyllabusItem({ courseId, material, index, isEnrolled, userId }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // --- 1. TAMPILAN JIKA SUDAH ENROLL (Link Biasa) ---
  if (isEnrolled) {
    return (
      <Link href={`/learn/${courseId}/${material.id}`}>
         <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full group">
             <h3 className="font-bold text-sm mb-3 text-[#2e385b] group-hover:text-blue-600 transition-colors line-clamp-2">
                 Modul {index + 1}: {material.title}
             </h3>
             <ul className="space-y-2 text-xs text-gray-500">
                 <li className="flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">
                        <HiPlay />
                     </span>
                     <span>Video ({material.videoType})</span>
                 </li>
                 <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-blue-400 ml-2"></span>
                     <span className="truncate max-w-[200px]">{material.description ? 'Penjelasan Lengkap' : 'Teori Dasar'}</span>
                 </li>
             </ul>
         </div>
      </Link>
    );
  }

  // --- 2. LOGIC JIKA BELUM ENROLL (Modal Trigger) ---
  
  const handleEnroll = () => {
    if (!userId) {
       router.push('/auth'); // Lempar ke login jika belum login
       return;
    }

    startTransition(async () => {
      const result = await enrollCourse(courseId, userId);
      if (result.success) {
        setIsOpen(false);
        router.push(`/learn/${courseId}`); // Masuk ke player setelah sukses
      } else {
        alert(result.message || 'Gagal mendaftar');
      }
    });
  };

  return (
    <>
      {/* Tampilan Item (Diklik muncul Modal) */}
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md hover:border-gray-300 transition-all cursor-pointer h-full group relative opacity-80 hover:opacity-100"
      >
         {/* Icon Gembok (Visual Cue bahwa ini terkunci) */}
         <div className="absolute top-4 right-4 text-gray-300 group-hover:text-gray-500">
            <HiLockClosed size={20} />
         </div>

         <h3 className="font-bold text-sm mb-3 text-gray-600 group-hover:text-[#2e385b] transition-colors line-clamp-2 pr-6">
             Modul {index + 1}: {material.title}
         </h3>
         <ul className="space-y-2 text-xs text-gray-500">
             <li className="flex items-center gap-2">
                 <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px]">
                    <HiPlay />
                 </span>
                 <span>Video ({material.videoType})</span>
             </li>
         </ul>
      </div>

      {/* --- MODAL KONFIRMASI (Sama seperti tombol utama) --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#2e385b]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 bg-blue-50 text-[#2e385b] rounded-full flex items-center justify-center mx-auto mb-6">
              <HiExclamation size={32} />
            </div>

            <h3 className="text-xl font-bold text-[#2e385b] text-center mb-2">
              Akses Materi Ini?
            </h3>
            
            <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
              Anda perlu mendaftar kelas <b>Gratis</b> ini terlebih dahulu untuk mengakses materi. Ingin daftar sekarang?
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
                {isPending ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'Ya, Daftar & Buka'
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}