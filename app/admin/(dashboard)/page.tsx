import React from 'react';
import Link from 'next/link'; // Import Link
import { prisma } from '../../lib/prisma'; 
import { HiBookOpen, HiUsers, HiShieldCheck, HiTrendingUp, HiArrowRight } from 'react-icons/hi';

export default async function DashboardPage() {
  
  const [totalCourses, totalStudents, totalAdmins] = await Promise.all([
    prisma.course.count(),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
  ]);

  return (
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Kursus -> /admin/courses */}
        <Link href="/admin/courses" className="group block">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between">
                {/* Background Decoration */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Total Kursus</h3>
                        <p className="text-4xl font-extrabold text-[#2e385b]">{totalCourses}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-[#2e385b] rounded-2xl flex items-center justify-center text-2xl group-hover:bg-[#2e385b] group-hover:text-white transition-colors">
                        <HiBookOpen />
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    <span>Kelola Kursus</span>
                    <HiArrowRight />
                </div>
            </div>
        </Link>

        {/* Card 2: Siswa -> /admin/users */}
        <Link href="/admin/users" className="group block">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Total Siswa</h3>
                        <p className="text-4xl font-extrabold text-[#2e385b]">{totalStudents}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <HiUsers />
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    <span>Lihat Pengguna</span>
                    <HiArrowRight />
                </div>
            </div>
        </Link>

        {/* Card 3 : Admin -> /admin/users */}
        <Link href="/admin/users" className="group block">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Total Admin</h3>
                        <p className="text-4xl font-extrabold text-[#2e385b]">{totalAdmins}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <HiShieldCheck />
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    <span>Detail Admin</span>
                    <HiArrowRight />
                </div>
            </div>
        </Link>

      </div>

      <div className="bg-gradient-to-r from-[#2e385b] to-[#1e2540] rounded-3xl p-8 text-white flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Halo Admin! 👋</h2>
            <p className="text-blue-100 text-sm max-w-md leading-relaxed">
                Selamat datang di panel kontrol MyCourse. Pantau perkembangan platform dan kelola konten pembelajaran dengan mudah dari sini.
            </p>
        </div>
      
        <div className="hidden md:block absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
             <HiTrendingUp className="text-9xl" />
        </div>
      </div>
      
    </div>
  );
}