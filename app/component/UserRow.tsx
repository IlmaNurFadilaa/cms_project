'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@prisma/client'; // Pastikan path import type benar

// 1. IMPORT COMPONENT DELETE CANGGIH & SERVER ACTION
import GenericDeleteButton from '@/app/component/AdminDeleteButton'; 
import { deleteUser } from '@/app/actions/admin'; 

// Import Icon Edit saja (Icon Trash sudah ada di dalam GenericDeleteButton)
import { HiPencil } from 'react-icons/hi'; 

interface UserRowProps {
  user: User;
}

export default function UserRow({ user }: UserRowProps) {
  
  // 2. WRAPPER FUNCTION
  // GenericDeleteButton butuh return { success: boolean, error?: string }
  // Kita sesuaikan response dari Server Action di sini
  const handleDeleteWrapper = async (id: string) => {
    const result = await deleteUser(id);
    
    // Asumsi server action return { success: true } atau { success: false, message: '...' }
    return {
        success: result.success,
        error: result.message // Mapping 'message' ke 'error' jika ada
    };
  };

  return (
    <tr className="group relative hover:bg-[#f0f7ff] transition border-b border-gray-50 last:border-none">
      
      {/* Kolom 1: Profil & Nama */}
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
             {user.image ? (
               <Image src={user.image} alt={user.name || ''} fill className="object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                 {(user.name?.[0] || 'U').toUpperCase()}
               </div>
             )}
          </div>
          <div>
            <span className="font-bold text-[#2e385b] block">{user.name || 'Tanpa Nama'}</span>
            <span className="text-xs text-gray-400">ID: {user.id.slice(0, 6)}...</span>
          </div>
        </div>
      </td>

      {/* Kolom 2: Email */}
      <td className="p-4 text-gray-500">{user.email}</td>

      {/* Kolom 3: Role (Badge) */}
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${
          user.role === 'ADMIN' 
            ? 'bg-purple-50 text-purple-600 border-purple-200' 
            : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}>
          {user.role}
        </span>
      </td>

      {/* Kolom 4: Aksi */}
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
            
            {/* Tombol Edit */}
            <Link 
              href={`/admin/users/${user.id}/edit`} 
              className="text-gray-400 hover:text-blue-600 p-2 rounded-lg transition hover:bg-blue-50"
              title="Edit User"
            >
              <HiPencil className="w-5 h-5" />
            </Link>

            {/* 3. TOMBOL DELETE DENGAN MODAL */}
            <GenericDeleteButton 
                id={user.id}
                title={user.name || user.email} // Nama user yang muncul di text konfirmasi
                typeLabel="Pengguna" // Label: "Hapus Pengguna?"
                onDelete={handleDeleteWrapper}
            />
            
        </div>
      </td>
    </tr>
  );
}