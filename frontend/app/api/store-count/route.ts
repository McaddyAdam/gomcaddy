import { NextResponse } from 'next/server';
import { getStoreCount } from '@/lib/server-api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    const storeCount = await getStoreCount();
    return NextResponse.json(storeCount, { headers });
  } catch (error) {
    console.error('Unexpected error fetching store counts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers });
}
