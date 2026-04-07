import { NextResponse } from 'next/server';
import { Restaurant } from '@/types/types';
import { fetchBackend } from '@/lib/backend-api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const backendSearchParams = new URLSearchParams();

    for (const key of ['type', 'category', 'search']) {
      const value = searchParams.get(key);
      if (value) {
        backendSearchParams.set(key, value);
      }
    }

    const queryString = backendSearchParams.toString();
    const restaurants = await fetchBackend<Restaurant[]>(
      `/api/restaurants${queryString ? `?${queryString}` : ''}`
    );

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    return NextResponse.json(restaurants, { headers });
  } catch (error) {
    console.error('Unexpected error fetching restaurants:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
