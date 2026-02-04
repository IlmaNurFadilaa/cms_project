'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function enrollCourse(courseId: string, userId: string) {
  if (!userId || !courseId) {
    return { success: false, message: 'Data tidak valid' };
  }

  try {
    // Cek apakah user sudah terdaftar (double check server-side)
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return { success: true, message: 'Sudah terdaftar' };
    }

    // Buat data Enrollment baru
    await prisma.enrollment.create({
      data: {
        userId,
        courseId
      }
    });

    // Revalidate halaman agar status tombol berubah
    revalidatePath(`/courses/${courseId}`);
    revalidatePath('/my-learning');

    return { success: true };
    
  } catch (error) {
    console.error("Enrollment Error:", error);
    return { success: false, message: 'Gagal mendaftar kursus' };
  }
}