import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
  },
  { versionKey: false }
);

const categorySnapshotSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
  },
  { _id: false }
);

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: { type: String, required: true, trim: true },
    prepTime: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: false },
  },
  { _id: true }
);

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    categories: { type: [categorySnapshotSchema], default: [] },
    ratings: { type: [Number], default: [] },
    menu: { type: [menuItemSchema], default: [] },
    discount: { type: Number, default: null },
    deliveryInfo: { type: String, default: null, trim: true },
    type: { type: String, enum: ['restaurant', 'grocery'], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true, versionKey: false }
);

const orderItemSchema = new Schema(
  {
    itemId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    restaurantId: { type: String, required: true, trim: true },
    restaurantName: { type: String, required: true, trim: true },
    items: { type: [orderItemSchema], default: [] },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['pay_on_delivery'],
      default: 'pay_on_delivery',
      required: true,
    },
    deliveryAddress: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    note: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;
export type RestaurantDocument = InferSchemaType<typeof restaurantSchema>;
export type UserDocument = InferSchemaType<typeof userSchema>;
export type OrderDocument = InferSchemaType<typeof orderSchema>;

export const CategoryModel =
  (mongoose.models.Category as Model<CategoryDocument>) ||
  mongoose.model<CategoryDocument>('Category', categorySchema);

export const RestaurantModel =
  (mongoose.models.Restaurant as Model<RestaurantDocument>) ||
  mongoose.model<RestaurantDocument>('Restaurant', restaurantSchema);

export const UserModel =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>('User', userSchema);

export const OrderModel =
  (mongoose.models.Order as Model<OrderDocument>) ||
  mongoose.model<OrderDocument>('Order', orderSchema);
