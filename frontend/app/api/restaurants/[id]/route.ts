import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantById } from '@/lib/server-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await getRestaurantById(params.id);

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch restaurant' },
      { status: 500 }
    );
  }
}
