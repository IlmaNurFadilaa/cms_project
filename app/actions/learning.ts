'use server'

import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/auth';
import { revalidatePath } from 'next/cache';

export async function enrollCourse(courseId: string) {
  const user = await getSessionUser();
  if (!user) return { success: false, message: 'Harus login dulu' };

  try {
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId
        }
      }
    });

    if (existing) return { success: true }; 

    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId
      }
    });

    revalidatePath('/my-learning');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Gagal enroll' };
  }
}

export async function markMaterialComplete(materialId: string, isCompleted: boolean) {
  const user = await getSessionUser();
  if (!user) return { success: false };

  try {
    if (isCompleted) {
        await prisma.userProgress.upsert({
            where: {
                userId_materialId: { userId: user.id, materialId }
            },
            update: { isCompleted: true },
            create: { userId: user.id, materialId, isCompleted: true }
        });
    } else {
        await prisma.userProgress.updateMany({
            where: { userId: user.id, materialId },
            data: { isCompleted: false }
        });
    }

    revalidatePath('/learn'); 
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}