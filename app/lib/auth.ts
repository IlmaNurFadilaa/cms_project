import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: sessionId },
      select: { id: true, name: true, email: true, role: true, image: true }
    });
    return user;
  } catch (error) {
    return null;
  }
}