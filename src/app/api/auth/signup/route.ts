import { NextResponse } from 'next/server';
import { createUser, createSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, password } = await request.json();
    
    // Validation
    if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }
    
    try {
      const user = createUser(fullName.trim(), email.trim(), phone.trim(), password);
      const token = createSessionToken(user.id);
      
      const response = NextResponse.json({
        success: true,
        user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone }
      });
      
      // Set session cookie
      response.cookies.set('session', token, {
        httpOnly: true,
        secure: false, // set to true in production
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
      
      return response;
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Server error during signup.' }, { status: 500 });
  }
}
