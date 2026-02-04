'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    // 1. LOGIKA UNTUK HALAMAN COURSE (Terpisah)
    if (pathname.startsWith('/courses')) {
      setActiveId('course');
      return; // Stop, jangan jalankan scroll spy home
    }

    // 2. LOGIKA SCROLL SPY UNTUK HALAMAN HOME
    if (pathname === '/') {
      const handleScroll = () => {
        const aboutSection = document.getElementById('about');
        const contactSection = document.getElementById('contact');
        
        // Posisi scroll saat ini + offset (biar ganti aktifnya pas tengah layar)
        const scrollPosition = window.scrollY + 200; 

        // Logika Cek Posisi (Urutan Cek: Dari Bawah ke Atas)
        
        // Cek Contact (Footer)
        if (contactSection && contactSection.offsetTop <= scrollPosition) {
            setActiveId('contact');
        } 
        // Cek About
        else if (aboutSection && aboutSection.offsetTop <= scrollPosition) {
            setActiveId('about');
        } 
        // Sisanya dianggap Home (Hero Section)
        else {
            setActiveId('home');
        }
      };

      // Pasang Event Listener
      window.addEventListener('scroll', handleScroll);
      // Panggil sekali biar langsung update saat refresh
      handleScroll(); 
      
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
        // Jika di halaman lain (misal login), matikan semua active state
        setActiveId('');
    }

  }, [pathname]);

  // Helper untuk class active
  const getLinkClass = (id: string) => {
    return activeId === id 
      ? "text-[#2e385b] font-bold border-b-2 border-[#2e385b] pb-1 cursor-pointer"
      : "text-gray-600 hover:text-[#2e385b] transition font-medium cursor-pointer";
  };

  return (
    <div className="hidden md:flex gap-8 items-center">
      {/* HOME */}
      <Link href="/" onClick={() => setActiveId('home')} className={getLinkClass('home')}>
        Home
      </Link>
      
      {/* ABOUT */}
      <Link href="/#about" onClick={() => setActiveId('about')} className={getLinkClass('about')}>
        About
      </Link>
      
      {/* COURSE (Halaman Terpisah) */}
      <Link href="/courses" className={getLinkClass('course')}>
        Course
      </Link>
      
      {/* CONTACT */}
      <Link href="/#contact" onClick={() => setActiveId('contact')} className={getLinkClass('contact')}>
        Contact
      </Link>
    </div>
  );
}