import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil cookie session
  // (Pastikan nama cookie ini sesuai dengan yang kamu set di auth.ts saat login)
  // Biasanya namanya 'session' atau 'token'.
  const session = request.cookies.get('session'); 
  
  // 2. Ambil path URL yang sedang diakses
  const path = request.nextUrl.pathname;

  // --- LOGIKA PROTEKSI ---

  // KASUS A: User mau masuk ke halaman ADMIN atau LEARN tapi BELUM LOGIN
  if ((path.startsWith('/admin') || path.startsWith('/learn')) && !session) {
    // Redirect paksa ke halaman login
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // KASUS B: User mau masuk halaman LOGIN tapi SUDAH LOGIN
  // (Biar gak login dua kali, lempar langsung ke dashboard atau home)
  if (path === '/auth' && session) {
    // Bisa diarahkan ke admin atau home, tergantung kebutuhan
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Jika aman, lanjutkan permintaan
  return NextResponse.next();
}

// Konfigurasi: Middleware ini hanya akan jalan di route mana saja?
export const config = {
  matcher: [
    /*
     * Match semua request path kecuali:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};