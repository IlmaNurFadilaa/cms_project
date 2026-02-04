'use server';

import { prisma } from '@/app/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Level, VideoType, Role } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises'; 
import { join } from 'path';
import { hash } from 'bcrypt';
import { generateShortId } from '@/app/lib/id'; 

// --- CREATE COURSE ---
export async function createCourse(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const level = formData.get('level') as Level;
  const isPublished = formData.get('isPublished') === 'on';
  
  const file = formData.get('image') as File;
  let imagePath = ''; 

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const path = join(uploadDir, file.name);
    await writeFile(path, buffer);
    imagePath = `/uploads/${file.name}`;
  } else {
    imagePath = '/default-course.png'; 
  }

  await prisma.course.create({
    data: { 
        id: generateShortId(), 
        title, 
        description, 
        categoryId, 
        level, 
        image: imagePath, 
        isPublished 
    }
  });

  revalidatePath('/admin/courses');
  redirect('/admin/courses');
}

// --- UPDATE COURSE ---
export async function updateCourse(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const level = formData.get('level') as Level;
  const isPublished = formData.get('isPublished') === 'on';
  const file = formData.get('image') as File;
  
  const updateData: any = { title, description, categoryId, level, isPublished };

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const path = join(uploadDir, file.name);
    await writeFile(path, buffer);
    updateData.image = `/uploads/${file.name}`;
  } 

  await prisma.course.update({ where: { id }, data: updateData });
  revalidatePath('/admin/courses');
  redirect('/admin/courses');
}

export async function deleteCourse(id: string) {
  try {
    await prisma.course.delete({
      where: { id }
    });
    revalidatePath('/admin/courses'); 
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete course" };
  }
}

// --- CREATE MATERIAL ---
export async function createMaterial(formData: FormData) {
  const courseId = formData.get('courseId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  const rawType = formData.get('videoType') as string;
  const videoType = rawType === 'UPLOAD' ? VideoType.UPLOAD : VideoType.YOUTUBE;
  
  let finalVideoUrl = "";

  if (videoType === VideoType.YOUTUBE) {
    finalVideoUrl = formData.get('videoUrl') as string;
  } else {
    const file = formData.get('videoFile') as File;
    if (file && file.size > 0) {
       const bytes = await file.arrayBuffer();
       const buffer = Buffer.from(bytes);
       const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
       await mkdir(uploadDir, { recursive: true });
       const path = join(uploadDir, file.name);
       await writeFile(path, buffer);
       finalVideoUrl = `/uploads/videos/${file.name}`;
    }
  }

  await prisma.material.create({
    data: {
      id: generateShortId(), 
      courseId,
      title,
      description,
      videoType: videoType, 
      videoUrl: finalVideoUrl,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

// --- UPDATE MATERIAL ---
export async function updateMaterial(formData: FormData) {
  const id = formData.get('id') as string;
  const courseId = formData.get('courseId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  const rawType = formData.get('videoType') as string;
  const videoType = rawType === 'UPLOAD' ? VideoType.UPLOAD : VideoType.YOUTUBE;
  
  const updateData: any = { title, description, videoType };

  if (videoType === VideoType.YOUTUBE) {
     const urlInput = formData.get('videoUrl') as string;
     if (urlInput) updateData.videoUrl = urlInput;
  } else {
     const file = formData.get('videoFile') as File;
     if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
        await mkdir(uploadDir, { recursive: true });
        const path = join(uploadDir, file.name);
        await writeFile(path, buffer);
        updateData.videoUrl = `/uploads/videos/${file.name}`;
     } 
  }

  await prisma.material.update({ where: { id }, data: updateData });
  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

// --- DELETE MATERIAL ---
export async function deleteMaterial(materialId: string) {
  try {
    await prisma.material.delete({
      where: { id: materialId },
    });
    revalidatePath('/admin/courses'); 
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus materi:", error);
    return { success: false, message: 'Gagal menghapus materi.' };
  }
}

// --- CREATE USER ---
export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as 'USER' | 'ADMIN';
  const passwordRaw = formData.get('password') as string;
  const imageFile = formData.get('image') as File;

  const hashedPassword = await hash(passwordRaw, 10);

  let imagePath = '';

  await prisma.user.create({
    data: {
      id: generateShortId(), 
      name,
      email,
      password: hashedPassword,
      role,
      image: imagePath,
    },
  });

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

// --- UPDATE USER ---
export async function updateUser(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as 'USER' | 'ADMIN';
  const passwordRaw = formData.get('password') as string;

  const dataToUpdate: any = {
    name,
    email,
    role,
  };

  if (passwordRaw && passwordRaw.trim() !== '') {
    dataToUpdate.password = await hash(passwordRaw, 10);
  }
  await prisma.user.update({
    where: { id },
    data: dataToUpdate,
  });

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

// --- DELETE USER ---
export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus user:", error);
    return { success: false, error: 'Gagal menghapus user. Mungkin user ini memiliki data relasi (komentar/kursus).' };
  }
}