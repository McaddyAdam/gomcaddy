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

export type CategoryDocument = InferSchemaType<typeof categorySchema>;
export type RestaurantDocument = InferSchemaType<typeof restaurantSchema>;
export type UserDocument = InferSchemaType<typeof userSchema>;

export const CategoryModel =
  (mongoose.models.Category as Model<CategoryDocument>) ||
  mongoose.model<CategoryDocument>('Category', categorySchema);

export const RestaurantModel =
  (mongoose.models.Restaurant as Model<RestaurantDocument>) ||
  mongoose.model<RestaurantDocument>('Restaurant', restaurantSchema);

export const UserModel =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>('User', userSchema);
