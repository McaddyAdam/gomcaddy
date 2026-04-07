import { NextResponse } from 'next/server';
import { getRestaurants } from '@/lib/server-api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurants = await getRestaurants({
      type: searchParams.get('type'),
      category: searchParams.get('category'),
      search: searchParams.get('search'),
    });

    return NextResponse.json(restaurants, { headers });
  } catch (error) {
    console.error('Unexpected error fetching restaurants:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers });
}
