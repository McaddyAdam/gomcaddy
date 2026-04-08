import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { OrderModel } from '@/lib/server-models';

interface TokenPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

interface OrderItemInput {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

function getTokenPayload(request: NextRequest): TokenPayload {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_SECRET in frontend environment variables.');
  }

  return jwt.verify(token, secret) as TokenPayload;
}

export async function GET(request: NextRequest) {
  try {
    const payload = getTokenPayload(request);

    await connectToDatabase();
    const orders = await OrderModel.find({ userId: payload.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      orders.map((order: any) => ({
        id: order._id.toString(),
        restaurantId: order.restaurantId,
        restaurantName: order.restaurantName,
        items: (order.items || []).map((item: any) => ({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: order.total,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        phone: order.phone,
        note: order.note || '',
        status: order.status,
        createdAt: order.createdAt,
      }))
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    const status =
      message === 'Unauthorized' || message.toLowerCase().includes('jwt') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getTokenPayload(request);
    const body = await request.json();

    const restaurantId = String(body?.restaurantId || '').trim();
    const restaurantName = String(body?.restaurantName || '').trim();
    const deliveryAddress = String(body?.deliveryAddress || '').trim();
    const phone = String(body?.phone || '').trim();
    const note = String(body?.note || '').trim();
    const paymentMethod = String(body?.paymentMethod || '').trim();
    const rawItems = Array.isArray(body?.items) ? body.items : [];

    const items: OrderItemInput[] = rawItems
      .map((item: any) => ({
        itemId: String(item?.itemId || '').trim(),
        name: String(item?.name || '').trim(),
        price: Number(item?.price),
        quantity: Number(item?.quantity),
      }))
      .filter(
        (item: OrderItemInput) =>
          item.itemId &&
          item.name &&
          Number.isFinite(item.price) &&
          item.price >= 0 &&
          Number.isFinite(item.quantity) &&
          item.quantity >= 1
      );

    if (!restaurantId || !restaurantName) {
      return NextResponse.json(
        { error: 'Restaurant details are required' },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'At least one order item is required' },
        { status: 400 }
      );
    }

    if (paymentMethod !== 'pay_on_delivery') {
      return NextResponse.json(
        { error: 'Only pay on delivery is currently supported' },
        { status: 400 }
      );
    }

    if (!deliveryAddress) {
      return NextResponse.json(
        { error: 'Delivery address is required' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await connectToDatabase();
    const order = await OrderModel.create({
      userId: payload.id,
      userName: body?.userName || payload.email,
      userEmail: payload.email,
      restaurantId,
      restaurantName,
      items,
      total: Number(total.toFixed(2)),
      paymentMethod: 'pay_on_delivery',
      deliveryAddress,
      phone,
      note,
    });

    return NextResponse.json(
      {
        message: 'Order placed successfully',
        orderId: order._id.toString(),
        status: order.status,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to place order';
    const status =
      message === 'Unauthorized' || message.toLowerCase().includes('jwt') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
