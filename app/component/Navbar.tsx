'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import NavLinks from './NavLinks'; 
import UserMenu from './UserMenu'; 

interface NavbarProps {
  user?: any;
}

export default function Navbar({ user = null }: NavbarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const currentUser = user;
  const isValidUser = currentUser && typeof currentUser === 'object' && 'id' in currentUser;

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- LOGIC REVISI: Sembunyikan Navbar di Admin, Auth, dan Edit Profil ---
  const isHiddenPage = pathname && (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/auth') || 
    pathname.startsWith('/profile/edit') // <-- Tambahkan baris ini
  );

  if (isHiddenPage) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-[999] shadow-sm transition-all"> 
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
        
        {/* LOGO */}
        <div className="text-2xl font-extrabold text-[#2e385b]">
          <Link href="/" className="hover:opacity-80 transition">MyCourse</Link>
        </div>

        {/* MENU TENGAH */}
        <div className="hidden md:block">
           <NavLinks />
        </div>

        {/* MENU KANAN */}
        <div className="flex items-center gap-4">
          {isValidUser ? (
            <UserMenu user={currentUser} />
          ) : (
            <Link href="/auth">
              <button className="px-6 py-2.5 bg-[#2e385b] text-white rounded-full font-bold text-sm shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#1f263e]">
                Login
              </button>
            </Link>
          )}
        </div>

      </nav>
    </div>
  );
}