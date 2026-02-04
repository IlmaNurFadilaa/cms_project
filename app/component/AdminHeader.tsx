'use client';

import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();

  const getHeaderInfo = () => {
    // EDIT USER
    if (pathname.includes('/admin/users') && pathname.endsWith('/edit')) {
      return { title: 'Edit Pengguna', desc: 'Perbarui informasi profil atau role pengguna.' };
    }

    //  LOGIKA MATERI (MATERIALS) ---
    
    // EDIT MATERI
    if (pathname.includes('/materials/') && pathname.endsWith('/edit')) {
      return { title: 'Edit Materi', desc: 'Perbarui konten video atau deskripsi materi.' };
    }

    // TAMBAH MATERI (BARU DITAMBAHKAN)
    if (pathname.includes('/materials/') && pathname.endsWith('/create')) {
        return { title: 'Tambah Materi', desc: 'Upload video pembelajaran baru ke dalam kursus.' };
    }

    // DETAIL MATERI
    if (pathname.includes('/materials/') && !pathname.endsWith('/edit') && !pathname.endsWith('/create')) {
      return { title: 'Detail Materi', desc: 'Preview video dan informasi materi.' };
    }

    //  LOGIKA KURSUS (COURSES) ---

    // CREATE COURSE (Buat Kursus)
    if (pathname === '/admin/courses/create') {
      return { title: 'Add New Course', desc: 'Buat kelas baru untuk mahasiswa' };
    }

    // EDIT COURSE
    if (pathname.includes('/admin/courses') && pathname.endsWith('/edit')) {
      return { title: 'Edit Course', desc: 'Perbarui informasi kelas yang sudah ada' };
    }

    // DETAIL COURSE
    if (
      pathname.startsWith('/admin/courses/') && 
      !pathname.endsWith('/create') && 
      !pathname.endsWith('/edit') &&
      !pathname.includes('/materials/') 
    ) {
      return { title: 'Detail Kursus', desc: 'Detail informasi kursus dan manajemen materi' };
    }

    // LIST COURSES
    if (pathname === '/admin/courses') {
      return { title: 'Manajemen Kursus', desc: 'Kelola semua daftar kursus di sini' };
    }

    //  LOGIKA USER LAINNYA ---

    // LIST USERS
    if (pathname === '/admin/users') {
      return { title: 'Manajemen Pengguna', desc: 'Kelola data siswa dan admin' };
    }

    //  CREATE USERS
    if (pathname === '/admin/users/create') {
      return { title: 'Tambah Pengguna Baru', desc: 'Buat akun pengguna baru untuk siswa atau admin' };
    }

    //  LOGIKA KATEGORI (CATEGORIES) ---

    // CREATE CATEGORY
    if (pathname === '/admin/categories/create') {
        return { title: 'Tambah Kategori', desc: 'Buat topik baru untuk pengelompokan kursus' };
    }
    // LIST CATEGORIES
    if (pathname === '/admin/categories') {
        return { title: 'Manajemen Kategori', desc: 'Atur nama dan jenis kategori kursus' };
    }

    // AULT (Dashboard)
    return { title: 'Dashboard Overview', desc: 'Selamat datang kembali di panel admin' };
  };

  const info = getHeaderInfo();

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-[#2e385b]">{info.title}</h1>
      <p className="text-sm text-gray-500">{info.desc}</p>
    </div>
  );
}