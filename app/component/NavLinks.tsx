'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    
    if (pathname.startsWith('/courses')) {
      setActiveId('course');
      return; 
    }

    if (pathname === '/') {
      const handleScroll = () => {
        const aboutSection = document.getElementById('about');
        const contactSection = document.getElementById('contact');
        
        const scrollPosition = window.scrollY + 200; 
        
        // Cek Contact
        if (contactSection && contactSection.offsetTop <= scrollPosition) {
            setActiveId('contact');
        } 
        // Cek About
        else if (aboutSection && aboutSection.offsetTop <= scrollPosition) {
            setActiveId('about');
        } 
        // Sisanya dianggap Home 
        else {
            setActiveId('home');
        }
      };

      window.addEventListener('scroll', handleScroll);
      
      handleScroll(); 
      
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
        setActiveId('');
    }

  }, [pathname]);

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
      
      {/* COURSE */}
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