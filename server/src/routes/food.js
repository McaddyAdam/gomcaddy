import express from 'express';

const router = express.Router();

const restaurants = [
  { id: 1, name: 'Lagos Jollof Spot', cuisine: 'Nigerian • Rice', eta: '25-30 mins' },
  { id: 2, name: 'Abuja Suya Grill', cuisine: 'Nigerian • Grill', eta: '20-25 mins' },
  { id: 3, name: 'Port Harcourt Kitchen', cuisine: 'Nigerian • Seafood', eta: '30-35 mins' }
];

const menu = [
  { id: 1, name: 'Party Jollof Rice', price: 3500, category: 'Rice' },
  { id: 2, name: 'Chicken Suya Wrap', price: 2800, category: 'Grill' },
  { id: 3, name: 'Pounded Yam & Egusi', price: 4200, category: 'Traditional' },
  { id: 4, name: 'Pepper Soup', price: 3200, category: 'Soup' },
  { id: 5, name: 'Moi Moi Combo', price: 2000, category: 'Sides' }
];

router.get('/restaurants', (_req, res) => {
  res.json(restaurants);
});

router.get('/menu', (_req, res) => {
  res.json(menu);
});

export default router;
