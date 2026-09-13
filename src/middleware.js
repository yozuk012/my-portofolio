import { NextResponse } from 'next/server';

export function middleware(request) {
  // Supabase client menyimpan sesi di browser storage, bukan cookie.
  // Pemeriksaan akses dilakukan oleh AdminPage melalui supabase.auth.getUser().
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};