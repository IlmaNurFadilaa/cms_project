'use server'

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { generateShortId } from '@/app/lib/id'; // IMPORT HELPER

export async function createCategory(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;

  if (!name || name.trim() === '') {
    return { success: false, message: 'Nama kategori tidak boleh kosong.' };
  }

  try {
    await prisma.category.create({
      data: { 
        id: generateShortId(5), // <--- MANUAL ID
        name 
      },
    });
    
    revalidatePath('/admin/categories');
    return { success: true, message: 'Kategori berhasil ditambahkan.' };
  } catch (error: any) {
    if (error.code === 'P2002') {
        return { success: false, message: 'Nama kategori sudah ada.' };
    }
    return { success: false, message: 'Gagal menambahkan kategori.' };
  }
}

export async function deleteCategory(id: string) {
  try {
    const count = await prisma.course.count({ where: { categoryId: id } });
    if (count > 0) {
        return { success: false, message: 'Gagal! Masih ada kursus di kategori ini.' };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus kategori.' };
  }
}