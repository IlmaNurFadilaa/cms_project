'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { HiTrash, HiExclamation, HiXCircle } from 'react-icons/hi';

interface Props {
  id: string;
  title: string;
  typeLabel: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  className?: string;      
  children?: ReactNode;    
}

export default function GenericDeleteButton({ 
  id, title, typeLabel, onDelete, 
  className, children 
}: Props) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage('');

    const result = await onDelete(id);

    if (result.success) {
      setIsOpen(false);
      setErrorMessage('');
    } else {
      setErrorMessage(result.error || 'Terjadi kesalahan saat menghapus.');
    }
    
    setIsDeleting(false);
  };

  const toggleModal = (open: boolean) => {
    setIsOpen(open);
    if (!open) setErrorMessage('');
  }

  const buttonStyle = className 
    ? className 
    : "p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors";

  const buttonContent = children 
    ? children 
    : <HiTrash size={20} />;

  // --- KOMPONEN MODAL YANG AKAN DITELEPORTASI ---
  const ModalPortal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2e385b]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-gray-100 scale-100 animate-in zoom-in-95 duration-200">
        
        {/* ICON STATUS */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
            errorMessage ? 'bg-red-50 text-red-500' : 'bg-red-50 text-red-500'
        }`}>
          {errorMessage ? <HiXCircle size={32} /> : <HiExclamation size={32} />}
        </div>

        {/* JUDUL */}
        <h3 className="text-xl font-bold text-[#2e385b] text-center mb-2">
            {errorMessage ? 'Gagal Menghapus' : `Hapus ${typeLabel}?`}
        </h3>

        {/* KONTEN MODAL */}
        {errorMessage ? (
            <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <p className="text-sm text-red-600 font-medium leading-relaxed">
                        {errorMessage}
                    </p>
                </div>
                
                <button
                    onClick={() => toggleModal(false)}
                    className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition active:scale-95"
                >
                    Oke, Mengerti
                </button>
            </div>
        ) : (
            <>
                <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
                  Kamu yakin ingin menghapus {typeLabel.toLowerCase()} <span className="font-bold text-gray-800">"{title}"</span>? 
                  Data ini akan hilang selamanya.
                </p>

                <div className="flex gap-3">
                  <button
                    disabled={isDeleting}
                    onClick={() => toggleModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition active:scale-95 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isDeleting ? (
                       <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : 'Ya, Hapus'}
                  </button>
                </div>
            </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => toggleModal(true)}
        className={buttonStyle}
        title={`Hapus ${typeLabel}`}
      >
        {buttonContent}
      </button>

      {/* Gunakan CreatePortal agar Modal muncul di luar hirarki parent */}
      {isOpen && mounted && createPortal(<ModalPortal />, document.body)}
    </>
  );
}