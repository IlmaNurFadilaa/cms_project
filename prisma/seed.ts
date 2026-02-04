const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcrypt') // Pastikan bcrypt sudah terinstall

const prisma = new PrismaClient()

// 1. FUNGSI GENERATOR ID PENDEK (5 Karakter)
function generateShortId(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  console.log('🌱 Mulai menanam data...')

  // ==========================================
  // 1. BUAT AKUN ADMIN (Agar tidak perlu register manual)
  // ==========================================
  const passwordHash = await hash('admin123', 10) // Password: admin123
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {}, // Jika sudah ada, tidak diapa-apain
    create: {
      id: generateShortId(),
      name: 'Admin Master',
      email: 'admin@gmail.com',
      password: passwordHash,
      role: 'ADMIN', // Langsung jadi ADMIN
      image: '',
    },
  })
  console.log('✅ Admin user ready: admin@gmail.com / admin123')


  // ==========================================
  // 2. KATEGORI
  // ==========================================
  const catWeb = await prisma.category.upsert({
    where: { name: 'Web Development' },
    update: {},
    create: { 
        id: generateShortId(), // Manual ID
        name: 'Web Development' 
    },
  })

  const catDesign = await prisma.category.upsert({
    where: { name: 'UI/UX Design' },
    update: {},
    create: { 
        id: generateShortId(), // Manual ID
        name: 'UI/UX Design' 
    },
  })
  console.log('✅ Categories ready')


  // ==========================================
  // 3. KURSUS (WEB DEV)
  // ==========================================
  await prisma.course.create({
    data: {
      id: generateShortId(), // Manual ID Kursus
      title: 'Mastering Next.js 14',
      description: 'Panduan lengkap membuat website modern dengan App Router.',
      level: 'MENENGAH',
      categoryId: catWeb.id,
      image: 'https://placehold.co/600x400/png', 
      materials: {
        create: [
          {
            id: generateShortId(), // Manual ID Materi 1
            title: 'Instalasi & Setup',
            description: 'Cara install Node.js dan create-next-app.',
            videoType: 'YOUTUBE',
            videoUrl: 'https://www.youtube.com/watch?v=843nec-IvW0',
          },
          {
            id: generateShortId(), // Manual ID Materi 2
            title: 'Routing Dasar',
            description: 'Memahami file based routing.',
            videoType: 'YOUTUBE',
            videoUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
          }
        ],
      },
    },
  })

  // ==========================================
  // 4. KURSUS (DESIGN)
  // ==========================================
  await prisma.course.create({
    data: {
      id: generateShortId(), // Manual ID Kursus
      title: 'Dasar Figma untuk Pemula',
      description: 'Belajar desain interface dari nol banget.',
      level: 'PEMULA',
      categoryId: catDesign.id,
      image: 'https://placehold.co/600x400/orange',
      materials: {
        create: [
          {
            id: generateShortId(), // Manual ID Materi
            title: 'Pengenalan Tools Figma',
            description: 'Apa fungsi frame, rectangle, dan text.',
            videoType: 'YOUTUBE',
            videoUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
          }
        ],
      },
    },
  })

  console.log('🎉 YEAYY! Database sudah terisi data dummy & Admin.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })