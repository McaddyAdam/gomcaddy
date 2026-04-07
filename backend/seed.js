require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');

const categories = [
  { name: 'Rice', icon: '🍚' },
  { name: 'Chicken', icon: '🍗' },
  { name: 'Shawarma', icon: '🌯' },
  { name: 'Juice', icon: '🧃' },
  { name: 'Amala', icon: '🍛' },
  { name: 'Dodo Meat', icon: '🥩' },
  { name: 'Fastfood', icon: '🍔' },
  { name: 'Soup Bowl', icon: '🍲' },
  { name: 'Grocery', icon: '🛒' },
  { name: 'Doughnuts', icon: '🍩' },
  { name: 'Turkey', icon: '🦃' },
  { name: 'Sandwich', icon: '🥪' },
  { name: 'Ice Cream', icon: '🍦' },
  { name: 'Vegetable', icon: '🥬' },
  { name: 'Pastries', icon: '🧁' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Fries', icon: '🍟' },
  { name: 'Smoothies', icon: '🥤' },
  { name: 'Snacks', icon: '🍿' },
  { name: 'Grills', icon: '🍖' },
  { name: 'Small Chops', icon: '🍢' },
  { name: 'Pounded Yam', icon: '🍛' },
  { name: 'Native corner', icon: '🍲' },
  { name: 'Peppersoup', icon: '🍲' },
  { name: 'Drinks', icon: '🍷' },
];

const stores = [
  ['Jollof Square Sango', 'restaurant', ['Chicken', 'Rice'], 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80', 10, undefined, 4.3, 1050],
  ['MunchLunch Cafe', 'restaurant', ['Chicken', 'Fastfood'], 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80', 5, undefined, 4.6, 287],
  ['BMX GRILLZ', 'restaurant', ['Burger', 'Grills'], 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 10, undefined, 3.9, 412],
  ['Eat & Save', 'restaurant', ['Rice', 'Chicken'], 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=600&q=80', 15, undefined, 3.8, 823],
  ['Bee Hair Nutrients', 'grocery', ['Grocery'], 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&q=80', undefined, "This store handles it's own deliveries", 0, 0],
  ['Nolly Blitz & Grillz', 'restaurant', ['Grills', 'Shawarma'], 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80', undefined, undefined, 4.5, 557],
  ['Dulcet Essentials', 'grocery', ['Grocery'], 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', undefined, "This store handles it's own deliveries", 0, 0],
  ['T Toast Pastries and Kitchen', 'restaurant', ['Fastfood', 'Rice', 'Snacks'], 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', undefined, undefined, 4.2, 2925],
  ['African Table', 'restaurant', ['Pounded Yam', 'Soup Bowl', 'Native corner'], 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80', undefined, undefined, 3.7, 381],
  ['Oje Market', 'grocery', ['Grocery'], 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', undefined, undefined, 4.2, 1791],
  ['October 1st hotel', 'restaurant', ['Rice', 'Peppersoup'], 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80', undefined, undefined, 0, 0],
  ['Jay excel wine store', 'grocery', ['Drinks'], 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80', undefined, undefined, 0, 0],
  ['Chef Ola Smallchops & Grills', 'restaurant', ['Grills', 'Small Chops'], 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80', undefined, undefined, 4.4, 731],
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI in backend environment variables.');
  }

  await mongoose.connect(mongoUri);

  try {
    await Promise.all([
      Category.deleteMany({}),
      Restaurant.deleteMany({}),
      User.deleteMany({}),
    ]);

    const insertedCategories = await Category.insertMany(categories);
    const categoriesByName = new Map(insertedCategories.map((category) => [category.name, category]));

    await Restaurant.insertMany(
      stores.map(([name, type, categoryNames, image, discount, deliveryInfo, average, count]) => ({
        name,
        image,
        discount,
        deliveryInfo,
        type,
        ratings: generateRatings(average, count),
        menu: buildMenu(name, type),
        categories: categoryNames
          .map((categoryName) => categoriesByName.get(categoryName))
          .filter(Boolean)
          .map((category) => ({
            id: category._id,
            name: category.name,
            icon: category.icon,
          })),
      }))
    );

    console.log('MongoDB seeded successfully');
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

function buildMenu(storeName, type) {
  if (type === 'grocery') {
    return [
      {
        name: `${storeName} Fresh Basket`,
        description: 'A mixed pack of fresh produce and essentials for quick weekly shopping.',
        price: 18.5,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        prepTime: '20 mins',
        featured: true,
      },
      {
        name: `${storeName} Snack Box`,
        description: 'Cookies, drinks, and pantry staples picked for a convenient restock.',
        price: 12,
        image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        prepTime: '15 mins',
        featured: false,
      },
      {
        name: `${storeName} Family Essentials`,
        description: 'Rice, oil, noodles, and home staples bundled for a family-sized order.',
        price: 28,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        prepTime: '25 mins',
        featured: false,
      },
    ];
  }

  return [
    {
      name: `${storeName} Signature Combo`,
      description: 'Customer-favorite main meal served fresh with a side and house sauce.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      prepTime: '25 mins',
      featured: true,
    },
    {
      name: `${storeName} Lunch Special`,
      description: 'A balanced plate built for quick weekday cravings and easy delivery.',
      price: 11.5,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      prepTime: '18 mins',
      featured: false,
    },
    {
      name: `${storeName} Family Feast`,
      description: 'A bigger share pack with extra portions for groups, meetings, or dinner.',
      price: 24.75,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      prepTime: '35 mins',
      featured: false,
    },
  ];
}

function generateRatings(average, count) {
  if (count === 0) {
    return [];
  }

  const ratings = [];
  const targetSum = average * count;
  let currentSum = 0;

  for (let index = 0; index < count - 1; index += 1) {
    const rating = Math.floor(Math.random() * 5) + 1;
    ratings.push(rating);
    currentSum += rating;
  }

  const finalRating = Math.round(targetSum - currentSum);
  ratings.push(Math.max(1, Math.min(5, finalRating)));

  return ratings;
}

seed();
