const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Get all food items
router.get('/', async (req, res) => {
    try {
        const food = await Food.find();
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Seed food items
router.post('/seed', async (req, res) => {
    try {
        const sampleFood = [
            // Rice
            { name: 'Smoky Party Jollof', description: 'Legendary Nigerian party jollof with that signature smoky flavor, served with grilled chicken and dodo.', price: 5500, category: 'Rice', image: 'https://inc-azure-6lu70mo7n4.edgeone.app/smokeyjollof.jpg/``````````' },
            { name: 'Special Fried Rice', description: 'Freshly tossed Nigerian fried rice with veggies, liver, and shrimps, served with peppered fish.', price: 6000, category: 'Rice', image: 'https://images.unsplash.com/photo-1512058560566-42724afbc2bc?auto=format&fit=crop&q=80&w=800' },
            { name: 'Ofada Rice & Ayamase', description: 'Nutritious unpolished rice served with the famous green-pepper-based designer stew and assorted proteins.', price: 6500, category: 'Rice', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?auto=format&fit=crop&q=80&w=800' },
            
            // Swallows & Soups
            { name: 'Pounded Yam & Egusi', description: 'Silky smooth pounded yam served with rich melon seed soup, spinach, and assorted meat.', price: 7000, category: 'Swallow', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800' },
            { name: 'Amala & Abula', description: 'Authentic black yam flour with gbegiri, ewedu, and buka stew containing round-about and bokoto.', price: 5500, category: 'Swallow', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?auto=format&fit=crop&q=80&w=800' },
            { name: 'Eba & Seafood Okra', description: 'White garri served with luxury seafood okra soup containing fresh fish, shrimps, and crabs.', price: 8500, category: 'Swallow', image: 'https://images.unsplash.com/photo-1512414321303-34533036814b?auto=format&fit=crop&q=80&w=800' },
            { name: 'Wheat & Efo Riro', description: 'Healthy wheat swallow served with rich spinach and locust bean vegetable soup, featuring pan-seared fish.', price: 6500, category: 'Swallow', image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800' },
            
            // Grill & Protein
            { name: 'Beef Suya (Special)', description: 'Thinly sliced beef grilled over charcoal with yaji spice, onions, and cabbage.', price: 4000, category: 'Grill', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb0258143?auto=format&fit=crop&q=80&w=800' },
            { name: 'Asun (Spicy Goat)', description: 'Traditionally smoked goat meat chopped and tossed in a spicy pepper sauce.', price: 5000, category: 'Grill', image: 'https://images.unsplash.com/photo-1491960693564-421771d7e7ee?auto=format&fit=crop&q=80&w=800' },
            { name: 'Peppered Turkey', description: 'Crispy fried turkey chunks glazed in a sweet and spicy bell pepper reduction.', price: 5500, category: 'Grill', image: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&q=80&w=800' },
            { name: 'Gizdodo', description: 'A perfect marriage of peppered gizzard and fried plantain cubes with mixed veggies.', price: 4500, category: 'Snacks', image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=800' },
            
            // Snacks & Sides
            { name: 'Puff Puff (Party Pack)', description: 'Golden, chewy deep-fried dough balls. A classic Nigerian delight.', price: 2000, category: 'Snacks', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=80&w=800' },
            { name: 'Premium Meat Pie', description: 'Buttery shortcrust pastry filled with minced beef, potatoes, and carrots.', price: 1500, category: 'Snacks', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800' },
            { name: 'Akara & Custard', description: 'Deep-fried bean cakes served with creamy milk-infused custard.', price: 3000, category: 'Snacks', image: 'https://images.unsplash.com/photo-1589113124854-c1360051015b?auto=format&fit=crop&q=80&w=800' },
            { name: 'Moin Moin Elemi Meji', description: 'Rich steamed bean pudding with egg and fish stuffings.', price: 2500, category: 'Snacks', image: 'https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?auto=format&fit=crop&q=80&w=800' },
            
            // Drinks
            { name: 'Zobo (Hibiscus Ice)', description: 'Aromatic hibiscus flower extract infused with ginger, cloves, and pineapple.', price: 1500, category: 'Drinks', image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&q=80&w=800' },
            { name: 'Chapman (Signature)', description: 'The famous Nigerian mocktail with bitters, fanta, sprite, and cucumber.', price: 2500, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800' },
            { name: 'Fresh Palm Wine', description: 'Naturally tapped sweet palm wine (bottled for freshness).', price: 3000, category: 'Drinks', image: 'https://images.unsplash.com/photo-1563223552-30d01fda3eaa?auto=format&fit=crop&q=80&w=800' }
        ];
        await Food.deleteMany({});
        await Food.insertMany(sampleFood);
        res.json({ message: 'Database seeded successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

module.exports = router;
