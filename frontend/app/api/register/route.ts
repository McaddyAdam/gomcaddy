import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-api';
import type { AuthResponse } from '@/types/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await fetchBackend<AuthResponse>('/api/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 500 }
    );
  }
}
