'use server';

import { prisma } from '@/app/lib/prisma';
import { redirect } from 'next/navigation';
import { hash, compare } from 'bcrypt';
import { cookies } from 'next/headers';
import { generateShortId } from '@/app/lib/id';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const callbackUrl = (formData.get('callbackUrl') as string) || '/'; // Tangkap tujuan balik

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await compare(password, user.password))) {
    return { error: 'Email atau password salah!' }; 
  }

  const cookieStore = await cookies();
  cookieStore.set('session', user.id, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, 
    path: '/',
  });

  // Redirect sesuai role dan callbackUrl
  if (user.role === 'ADMIN') {
    redirect('/admin');
  } else {
    redirect(callbackUrl); 
  }
}

export async function registerAction(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const imageFile = formData.get('image') as File;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { error: 'Email sudah terdaftar!' };
  }

  const hashedPassword = await hash(password, 10);
  let imagePath = ''; 

  if (imageFile && imageFile.size > 0) {
    try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'users');
        await mkdir(uploadDir, { recursive: true }); 
        const uniqueName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
        const path = join(uploadDir, uniqueName);
        await writeFile(path, buffer);
        imagePath = `/uploads/users/${uniqueName}`;
    } catch (error) {
        console.error("Gagal upload foto profil:", error);
    }
  }

  const newUser = await prisma.user.create({
    data: {
      id: generateShortId(5), 
      name: `${firstName} ${lastName}`, 
      email,
      password: hashedPassword,
      role: 'USER', 
      image: imagePath,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set('session', newUser.id, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, 
    path: '/',
  });

  redirect('/');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  // Tidak perlu redirect di sini jika ingin ditangani oleh komponen, 
  // tapi biarkan saja agar aman.
  redirect('/auth');
}