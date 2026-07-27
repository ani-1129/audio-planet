import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, findUserById } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false });
    }
    
    const userId = verifySessionToken(sessionCookie.value);
    if (!userId) {
      return NextResponse.json({ authenticated: false });
    }
    
    const user = findUserById(userId);
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }
    
    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone }
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
