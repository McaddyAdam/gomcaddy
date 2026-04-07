import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/server-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const data = await loginUser({
      email: body.email,
      password: body.password,
      bcrypt,
    });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    const status = message === 'Invalid email or password' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
