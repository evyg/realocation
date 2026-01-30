import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear session cookies
  cookieStore.delete('realocation_session');
  cookieStore.delete('realocation_email');
  
  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  
  // Clear session cookies
  cookieStore.delete('realocation_session');
  cookieStore.delete('realocation_email');
  
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'https://realocation.app'));
}
