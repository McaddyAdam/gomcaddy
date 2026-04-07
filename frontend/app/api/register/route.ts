import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/server-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.name || !body?.email || !body?.password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const data = await registerUser({
      name: body.name,
      email: body.email,
      password: body.password,
      bcrypt,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    const status = message === 'User already exists' ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
