'use server';

import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function updateProfileAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  const name = formData.get('name') as string;
  const imageFile = formData.get('image') as File;

  let imagePath = user.image; // Gunakan foto lama sebagai default

  // Logika Upload Foto (Sama seperti Register)
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
    } catch (e) {
      console.error("Gagal upload foto:", e);
    }
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name,
        image: imagePath,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Gagal memperbarui database.' };
  }
}