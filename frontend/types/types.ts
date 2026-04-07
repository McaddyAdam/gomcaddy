export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  categories: Category[];
  menu: MenuItem[];
  ratings: {
    average: number;
    count: number;
  };
  discount?: number;
  deliveryInfo?: string;
  createdAt: string;
  type: 'restaurant' | 'grocery';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  prepTime: string;
  featured: boolean;
}

export interface StoreCount {
  total: number;
  restaurants: number;
  grocery: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
