'use client'; 

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { TbWorld } from 'react-icons/tb';

export default function Footer() {
  const pathname = usePathname();

  const isHidden = pathname && (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/auth') || 
    pathname.startsWith('/profile/edit')
  );

  if (isHidden) {
    return null;
  }

  return (
    <footer className="bg-gray-200 border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        
        {/* === KIRI: Logo Lebih Besar === */}
        <div className="text-5xl font-extrabold text-[#2e385b] tracking-tighter">
          <Link href="/">MyCourse</Link>
        </div>

        {/* === KANAN: Link Sosial Media === */}
        <div className="flex flex-col gap-5 text-[#2e385b]">
          
          {/* Instagram */}
          <Link href="https://instagram.com/mycourse.id" target="_blank" className="flex items-center gap-4 group">
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-[#2e385b] group-hover:text-white transition-all">
              <FaInstagram className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">@mycourse.id</span>
          </Link>

          {/* Facebook */}
          <Link href="https://facebook.com/mycourse" target="_blank" className="flex items-center gap-4 group">
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-[#2e385b] group-hover:text-white transition-all">
              <FaFacebookF className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">mycourse</span>
          </Link>

          {/* Website */}
          <Link href="https://mycourse.com" target="_blank" className="flex items-center gap-4 group">
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-[#2e385b] group-hover:text-white transition-all">
              <TbWorld className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">mycourse.com</span>
          </Link>
          
        </div>
      </div>
    </footer>
  );
}