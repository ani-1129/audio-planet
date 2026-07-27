import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, createSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email?.trim() || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }
    
    const user = findUserByEmail(email.trim());
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'No account found with this email. Please sign up first.' }, { status: 401 });
    }
    
    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ success: false, error: 'Incorrect password. Please try again.' }, { status: 401 });
    }
    
    const token = createSessionToken(user.id);
    
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone }
    });
    
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ success: false, error: 'Server error during sign in.' }, { status: 500 });
  }
}
