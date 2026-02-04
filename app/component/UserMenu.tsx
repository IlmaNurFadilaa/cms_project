'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import Link from 'next/link';
import Image from 'next/image';
import { logout } from '../actions/auth'; 
import { HiChartPie, HiUser, HiBookOpen, HiLogout, HiExclamation } from 'react-icons/hi';

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null; 
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false); 
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = (name: string | null | undefined) => {
    return name
      ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
      : 'U';
  };

  const menuItemClass = "flex items-center gap-3 px-5 py-3 text-sm text-gray-600 hover:text-[#2e385b] hover:bg-gray-50 transition font-medium w-full text-left";

  // --- KOMPONEN MODAL LOGOUT ---
  const LogoutModal = () => (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#2e385b]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiExclamation size={32} />
        </div>
        <h3 className="text-xl font-bold text-[#2e385b] text-center mb-2">Konfirmasi Keluar</h3>
        <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
          Apakah kamu yakin ingin keluar dari akunmu? Kamu perlu login kembali untuk mengakses kursus.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition active:scale-95"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              await logout();
            }}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition active:scale-95 flex justify-center items-center gap-2"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none transition-transform active:scale-95"
      >
        {user.image && user.image !== "" ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 hover:border-[#2e385b] transition">
                <Image src={user.image} alt="Profile" fill className="object-cover" sizes="40px" />
            </div>
        ) : (
            <div className="w-10 h-10 rounded-full bg-[#2e385b] text-white flex items-center justify-center font-bold text-sm border-2 border-gray-100 hover:border-[#2e385b] transition shadow-sm">
                {getInitials(user.name)}
            </div>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Signed in as</p>
              <p className="text-sm font-extrabold text-[#2e385b] truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="py-2">
                {user.role === 'ADMIN' && (
                   <Link href="/admin" className={menuItemClass} onClick={() => setIsOpen(false)}>
                     <HiChartPie className="text-lg text-gray-400" />
                     <span>Dashboard Admin</span>
                   </Link>
                )}
                <Link href="/my-learning" className={menuItemClass} onClick={() => setIsOpen(false)}>
                    <HiBookOpen className="text-lg text-gray-400" />
                    <span>Kursus Saya</span>
                </Link>
                <Link 
                    href="/profile" // Pastikan href sudah ke /profile
                    className={menuItemClass}
                    onClick={() => setIsOpen(false)}
                >
                    <HiUser className="text-lg text-gray-400" />
                    <span>My Profile</span>
                </Link>
            </div>

            <div className="border-t border-gray-100 mt-1 pt-1">
              
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className={`${menuItemClass} text-red-500 hover:text-red-600 hover:bg-red-50`}
                >
                  <HiLogout className="text-lg" />
                  <span>Sign Out</span>
                </button>
            </div>
          </div>
        </>
      )}


      {isLogoutModalOpen && mounted && createPortal(<LogoutModal />, document.body)}
    </div>
  );
}