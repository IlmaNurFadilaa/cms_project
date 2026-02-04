'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createUser, updateUser } from '@/app/actions/admin';
import { User, Role } from '@prisma/client';
import Image from 'next/image';

import { HiEye, HiEyeOff } from 'react-icons/hi'; 

interface UserFormProps {
  initialData?: User;
}

export default function UserForm({ initialData }: UserFormProps) {
  const isEdit = !!initialData;
  const action = isEdit ? updateUser : createUser;

  const [showPassword, setShowPassword] = useState(false);

  const [preview, setPreview] = useState<string | null>(initialData?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        alert("File terlalu besar (Max 2MB)");
        e.target.value = "";
        return;
      }
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form action={action} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
      
      {isEdit && <input type="hidden" name="id" value={initialData.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* KIRI: Upload Foto */}
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
           <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
             {preview ? (
               <Image src={preview} alt="Avatar" fill className="object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">👤</div>
             )}
           </div>
           
           <label className="cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
             {isEdit ? 'Ganti Foto' : 'Upload Foto'}
             <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} />
           </label>
           
           <p className="text-xs text-gray-400 mt-2">Max 2MB (JPG/PNG)</p>
           {isEdit && <p className="text-[10px] text-gray-400 mt-1">*Biarkan kosong jika tidak diganti</p>}
        </div>

        {/* KANAN: Input Data */}
        <div className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold mb-2 ml-1">Nama Lengkap</label>
            <input 
              name="name" 
              type="text" 
              defaultValue={initialData?.name || ''} 
              placeholder="Contoh: Budi Santoso"
              className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] outline-none transition" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 ml-1">Email</label>
            <input 
              name="email" 
              type="email" 
              defaultValue={initialData?.email || ''} 
              placeholder="budi@example.com"
              className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] outline-none transition" 
              required 
            />
          </div>

          {/* === INPUT PASSWORD === */}
          <div>
            <label className="block text-sm font-bold mb-2 ml-1">
              Password
            </label>
            
            <div className="relative">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder={isEdit ? "Biarkan kosong jika tidak diganti" : "Masukkan password..."}
                className="w-full p-4 pr-12 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] outline-none transition" 
                required={!isEdit} 
                minLength={6}
              />
              
              <button
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2e385b] transition"
              >
                {showPassword ? (
                  <HiEyeOff className="w-5 h-5" /> 
                ) : (
                  <HiEye className="w-5 h-5" />    
                )}
              </button>
            </div>

            {isEdit && (
              <p className="text-[10px] text-gray-400 mt-1 ml-1">
                *Isi hanya jika ingin mengubah password user ini.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 ml-1">Role / Peran</label>
            <div className="relative">
              <select 
                name="role" 
                defaultValue={initialData?.role || 'USER'} 
                className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#2e385b]"
              >
                
                <option value="USER">User (Murid)</option>
                <option value="ADMIN">Admin</option>
              </select>
              <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">▼</span>
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Link href="/admin/users">
          <button type="button" className="px-8 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition">
            Batal
          </button>
        </Link>
        <button type="submit" className="px-8 py-3 rounded-xl bg-[#2e385b] text-white font-bold hover:bg-[#1e253d] shadow-lg transition">
          {isEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}
        </button>
      </div>
    </form>
  );
}