import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, index: true },
  stock: Number,
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ createdAt: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });

export const Product = mongoose.model('Product', productSchema);
