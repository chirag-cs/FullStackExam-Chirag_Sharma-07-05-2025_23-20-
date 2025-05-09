import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.index({ createdAt: 1 });
orderItemSchema.index({ productId: 1 });
orderSchema.index({ userId: 1 });


export const Order = mongoose.model('Order', orderSchema);
