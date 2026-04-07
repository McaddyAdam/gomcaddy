import jwt from 'jsonwebtoken';
import type { Category, Restaurant, StoreCount, AuthResponse } from '@/types/types';
import { connectToDatabase } from '@/lib/mongodb';
import { CategoryModel, RestaurantModel, UserModel } from '@/lib/server-models';

export async function getCategories(): Promise<Category[]> {
  await connectToDatabase();
  const categories = await CategoryModel.find().sort({ name: 1 }).lean();

  return categories.map((category: any) => ({
    id: category._id.toString(),
    name: category.name,
    icon: category.icon,
  }));
}

export async function getStoreCount(): Promise<StoreCount> {
  await connectToDatabase();
  const [total, restaurants, grocery] = await Promise.all([
    RestaurantModel.countDocuments(),
    RestaurantModel.countDocuments({ type: 'restaurant' }),
    RestaurantModel.countDocuments({ type: 'grocery' }),
  ]);

  return { total, restaurants, grocery };
}

export async function getRestaurants(filters: {
  type?: string | null;
  category?: string | null;
  search?: string | null;
}): Promise<Restaurant[]> {
  await connectToDatabase();
  const query: Record<string, unknown> = {};

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.category) {
    query['categories.name'] = filters.category;
  }

  if (filters.search) {
    const regex = new RegExp(filters.search, 'i');
    query.$or = [{ name: regex }, { 'categories.name': regex }];
  }

  const restaurants = await RestaurantModel.find(query).sort({ name: 1 }).lean();
  return restaurants.map(formatRestaurant);
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  await connectToDatabase();
  const restaurant = await RestaurantModel.findById(id).lean();
  return restaurant ? formatRestaurant(restaurant as any) : null;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  bcrypt: typeof import('bcryptjs');
}): Promise<AuthResponse> {
  await connectToDatabase();
  const email = input.email.trim().toLowerCase();
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await input.bcrypt.hash(input.password, 10);
  const user = await UserModel.create({
    name: input.name.trim(),
    email,
    passwordHash,
  });

  return createAuthResponse(user);
}

export async function loginUser(input: {
  email: string;
  password: string;
  bcrypt: typeof import('bcryptjs');
}): Promise<AuthResponse> {
  await connectToDatabase();
  const email = input.email.trim().toLowerCase();
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValid = await input.bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  return createAuthResponse(user);
}

function createAuthResponse(user: any): AuthResponse {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Missing JWT_SECRET in frontend environment variables.');
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

function formatRestaurant(restaurant: any): Restaurant {
  const ratings = restaurant.ratings || [];
  const average =
    ratings.length > 0
      ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
      : 0;

  return {
    id: restaurant._id.toString(),
    name: restaurant.name,
    image: restaurant.image,
    categories: (restaurant.categories || []).map((category: any) => ({
      id: category.id.toString(),
      name: category.name,
      icon: category.icon,
    })),
    menu: (restaurant.menu || []).map((item: any) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      prepTime: item.prepTime,
      featured: item.featured,
    })),
    ratings: {
      average: Number(average.toFixed(1)),
      count: ratings.length,
    },
    discount: restaurant.discount ?? undefined,
    deliveryInfo: restaurant.deliveryInfo ?? undefined,
    createdAt: restaurant.createdAt,
    type: restaurant.type,
  };
}
