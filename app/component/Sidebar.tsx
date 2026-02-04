import React from 'react';
import { getSessionUser } from '@/app/lib/auth';
import { logout } from '@/app/actions/auth';    
import { HiLogout } from 'react-icons/hi';
import SidebarNav from './SidebarNav';

export default async function Sidebar() {

  const user = await getSessionUser();
  
  const userImage = user?.image || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=0D8ABC&color=fff`;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      
      {/* 1. HEADER PROFIL (Server Component) */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 flex-shrink-0">
          <img 
            src={userImage} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-sm text-[#2e385b] truncate">
            {user?.name || 'Admin'}
          </h3>
          <p className="text-[10px] text-gray-400 truncate">
            {user?.email || 'No Email'}
          </p>
        </div>
      </div>

      {/* 2. MENU NAVIGASI (Client Component) */}
      <SidebarNav />

      {/* 3. TOMBOL LOGOUT (Server Action) */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <form action={logout}>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer group">
            <HiLogout className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Logout</span>
            </button>
        </form>
      </div>

    </aside>
  );
};