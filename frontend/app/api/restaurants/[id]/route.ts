import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-api';
import type { Restaurant } from '@/types/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await fetchBackend<Restaurant>(`/api/restaurants/${params.id}`);
    return NextResponse.json(restaurant);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch restaurant' },
      { status: 500 }
    );
  }
}
