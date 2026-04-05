const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', foodSchema);
