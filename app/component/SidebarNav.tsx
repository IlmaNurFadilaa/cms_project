'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// 1. IMPORT ICON BARU (HiCollection)
import { HiChartPie, HiBookOpen, HiUsers, HiChatAlt2, HiHome, HiCollection } from 'react-icons/hi';

export default function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: HiChartPie },
    { name: 'Manajemen Kursus', href: '/admin/courses', icon: HiBookOpen },
    
    // 2. TAMBAHKAN MENU KATEGORI DI SINI (Supaya dekat dengan Kursus)
    { name: 'Kategori', href: '/admin/categories', icon: HiCollection },
    
    { name: 'Pengguna', href: '/admin/users', icon: HiUsers },
    { name: 'Komentar', href: '/admin/comments', icon: HiChatAlt2 },
  ];

  return (
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto flex flex-col">
      
      {menuItems.map((item) => {
        // Logika active state
        const isActive = item.href === '/admin' 
          ? pathname === item.href 
          : pathname.startsWith(item.href);

        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              isActive 
                ? 'bg-[#eef5ff] text-[#2e385b] font-bold shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#2e385b] font-medium'
            }`}
          >
            <item.icon className={`text-xl transition-colors ${
                isActive ? 'text-[#2e385b]' : 'text-gray-400 group-hover:text-[#2e385b]'
            }`} />
            <span className="text-sm">{item.name}</span>
          </Link>
        );
      })}

      <div className="my-2 border-t border-gray-100"></div>

      <Link 
        href="/" 
        className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[#2e385b] rounded-xl transition-colors font-medium"
      >
        <HiHome className="text-xl text-gray-400" />
        <span className="text-sm">Ke Halaman Utama</span>
      </Link>

    </nav>
  );
}