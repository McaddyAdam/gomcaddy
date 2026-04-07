const mongoose = require('mongoose');

const categorySnapshotSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    prepTime: {
      type: String,
      required: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    categories: {
      type: [categorySnapshotSchema],
      default: [],
    },
    ratings: {
      type: [Number],
      default: [],
    },
    menu: {
      type: [menuItemSchema],
      default: [],
    },
    discount: {
      type: Number,
      default: null,
    },
    deliveryInfo: {
      type: String,
      default: null,
      trim: true,
    },
    type: {
      type: String,
      enum: ['restaurant', 'grocery'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

module.exports = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);
