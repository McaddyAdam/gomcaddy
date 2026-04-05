const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const orderRoutes = require('./routes/orders');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const Food = require('./models/Food');
        const count = await Food.countDocuments();
        if (count === 0) {
            console.log('Seeding initial food data...');
            const sampleFood = [
                { name: 'Smoky Party Jollof', description: 'Legendary Nigerian party jollof with that signature smoky flavor, served with grilled chicken and dodo.', price: 5500, category: 'Rice', image: '/food-images/smokeyjollof.jpg' },
                { name: 'Special Fried Rice', description: 'Freshly tossed Nigerian fried rice with veggies, liver, and shrimps, served with peppered fish.', price: 6000, category: 'Rice', image: '/food-images/friedrice.jpg' },
                { name: 'Ofada Rice & Ayamase', description: 'Nutritious unpolished rice served with the famous green-pepper-based designer stew and assorted proteins.', price: 6500, category: 'Rice', image: '/food-images/ofadarice.jpg' },
                { name: 'Pounded Yam & Egusi', description: 'Silky smooth pounded yam served with rich melon seed soup, spinach, and assorted meat.', price: 7000, category: 'Swallow', image: '/food-images/egusi.webp' },
                { name: 'Amala & Abula', description: 'Authentic black yam flour with gbegiri, ewedu, and buka stew containing round-about and bokoto.', price: 5500, category: 'Swallow', image: '/food-images/amala.jpg' },
                { name: 'Eba & Seafood Okra', description: 'White garri served with luxury seafood okra soup containing fresh fish, shrimps, and crabs.', price: 8500, category: 'Swallow', image: '/food-images/ebaseafood.jpg' },
                { name: 'Wheat & Efo Riro', description: 'Healthy wheat swallow served with rich spinach and locust bean vegetable soup, featuring pan-seared fish.', price: 6500, category: 'Swallow', image: '/food-images/wheatefo.jpg' },
                { name: 'Beef Suya (Special)', description: 'Thinly sliced beef grilled over charcoal with yaji spice, onions, and cabbage.', price: 4000, category: 'Grill', image: '/food-images/Suya.webp' },
                { name: 'Asun (Spicy Goat)', description: 'Traditionally smoked goat meat chopped and tossed in a spicy pepper sauce.', price: 5000, category: 'Grill', image: '/food-images/asun.jpg' },
                { name: 'Peppered Chicken', description: 'Crispy fried chicken glazed in a sweet and spicy bell pepper reduction.', price: 5500, category: 'Grill', image: '/food-images/pepperedchicken.jpg' },
                { name: 'Gizdodo', description: 'A perfect marriage of peppered gizzard and fried plantain cubes with mixed veggies.', price: 4500, category: 'Snacks', image: '/food-images/gizdodo.jpg' },
                { name: 'Puff Puff (Party Pack)', description: 'Golden, chewy deep-fried dough balls. A classic Nigerian delight.', price: 2000, category: 'Snacks', image: '/food-images/puffpuff.jpg' },
                { name: 'Premium Meat Pie', description: 'Buttery shortcrust pastry filled with minced beef, potatoes, and carrots.', price: 1500, category: 'Snacks', image: '/food-images/meatpie.jpg' },
                { name: 'Akara & Custard', description: 'Deep-fried bean cakes served with creamy milk-infused custard.', price: 3000, category: 'Snacks', image: '/food-images/akaracustard.jpg' },
                { name: 'Moin Moin Elemi Meji', description: 'Rich steamed bean pudding with egg and fish stuffings.', price: 2500, category: 'Snacks', image: '/food-images/moimoi.jpg' },
                { name: 'Zobo (Hibiscus Ice)', description: 'Aromatic hibiscus flower extract infused with ginger, cloves, and pineapple.', price: 1500, category: 'Drinks', image: '/food-images/zobo.jpg' },
                { name: 'Chapman (Signature)', description: 'The famous Nigerian mocktail with bitters, fanta, sprite, and cucumber.', price: 2500, category: 'Drinks', image: '/food-images/chapman.webp' },
                { name: 'Fresh Palm Wine', description: 'Naturally tapped sweet palm wine (bottled for freshness).', price: 3000, category: 'Drinks', image: '/food-images/palmwine.jpg' }
            ];
            await Food.insertMany(sampleFood);
            console.log('Database seeded with Nigerian meals & snacks!');
        }
    })
    .catch((err) => console.log('Database connection error: ', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
