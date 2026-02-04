## MyCourse - Online Learning Platform

**MyCourse** adalah platform pembelajaran online modern yang dibangun menggunakan **Next.js 14**, **Prisma**, dan **Neon (PostgreSQL)**. Platform ini memungkinkan pengguna untuk mendaftar, mengikuti kursus, memantau progres belajar secara real-time, dan mendapatkan akses materi video interaktif.

Project ini dibuat untuk memenuhi tugas **Praktikum Pemrograman Web**.

### Fitur Utama

- **Autentikasi Aman**: Sistem Login & Register (User & Admin).
- **Katalog Kursus**: Browsing kursus berdasarkan kategori dan level.
- **Smart Progress Tracking**:
  - Menghitung persentase penyelesaian materi.
  - Status otomatis berubah menjadi **"Selesai"** (Hijau) jika semua materi ditamatkan.
  - Tombol **"Lanjut Belajar"** jika kursus belum selesai.
- **Sticky Sidebar**: Tampilan detail kursus dengan navigasi yang tetap terlihat saat di-scroll (UX Friendly).
- **Responsive Design**: Tampilan optimal di Mobile, Tablet, dan Desktop (Tailwind CSS).
- **Database Seeding**: Skrip otomatis untuk mengisi data kategori, kursus dummy, dan akun Admin.

### Tech Stack

- **Framework**: https://nextjs.org/ (App Router)
- **Language**: TypeScript
- **Database**: https://neon.tech/ (Serverless Postgres)
- **ORM**: https://www.prisma.io/
- **Styling**: https://tailwindcss.com/
- **Icons**: https://react-icons.github.io/react-icons/
- **Deployment**: https://vercel.com/

### Struktur Folder

- **/app**: Halaman dan Logika Next.js (App Router)
- **/app/component**: Komponen UI reusable (Navbar, Footer, CourseCard, dll)
- **/prisma**: Skema database (schema.prisma) dan seed data (seed.ts)
- **/public**: Aset statis (Gambar, Logo)
