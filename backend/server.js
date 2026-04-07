require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Category = require('./models/Category');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI in backend environment variables.');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}

function buildFallbackMenu(restaurant) {
  return [
    {
      id: `${restaurant._id}-1`,
      name: `${restaurant.name} Special`,
      description: 'Freshly prepared best-seller from this vendor.',
      price: 12.99,
      image: restaurant.image,
      prepTime: '20 mins',
      featured: true,
    },
    {
      id: `${restaurant._id}-2`,
      name: `${restaurant.name} Combo`,
      description: 'A balanced meal option that works well for lunch or dinner.',
      price: 9.99,
      image: restaurant.image,
      prepTime: '18 mins',
      featured: false,
    },
  ];
}

function formatRestaurant(restaurant) {
  const ratings = restaurant.ratings || [];
  const average = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;

  return {
    id: restaurant._id.toString(),
    name: restaurant.name,
    image: restaurant.image,
    categories: restaurant.categories.map((category) => ({
      id: category.id.toString(),
      name: category.name,
      icon: category.icon,
    })),
    ratings: {
      average: Number(average.toFixed(1)),
      count: ratings.length,
    },
    discount: restaurant.discount,
    deliveryInfo: restaurant.deliveryInfo,
    createdAt: restaurant.createdAt,
    type: restaurant.type,
    menu: restaurant.menu && restaurant.menu.length > 0
      ? restaurant.menu.map((item) => ({
          id: item._id.toString(),
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          prepTime: item.prepTime,
          featured: item.featured,
        }))
      : buildFallbackMenu(restaurant),
  };
}

function createToken(user) {
  const secret = process.env.JWT_SECRET || 'gomcaddy-dev-secret';

  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );
}

app.get('/', (req, res) => {
  res.send('Gomcaddy API');
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    res.json(
      categories.map((category) => ({
        id: category._id.toString(),
        name: category.name,
        icon: category.icon,
      }))
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/store-count', async (req, res) => {
  try {
    const [total, restaurants, grocery] = await Promise.all([
      Restaurant.countDocuments(),
      Restaurant.countDocuments({ type: 'restaurant' }),
      Restaurant.countDocuments({ type: 'grocery' }),
    ]);

    res.json({ total, restaurants, grocery });
  } catch (error) {
    console.error('Error fetching store counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const filters = {};

    if (type) {
      filters.type = type;
    }

    if (category) {
      filters['categories.name'] = category;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filters.$or = [{ name: regex }, { 'categories.name': regex }];
    }

    const restaurants = await Restaurant.find(filters).sort({ name: 1 }).lean();
    res.json(restaurants.map(formatRestaurant));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid restaurant id' });
    }

    const restaurant = await Restaurant.findById(id).lean();

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(formatRestaurant(restaurant));
  } catch (error) {
    console.error('Error fetching restaurant detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

module.exports = app;
