import { Request, Response } from 'express';
import { Cart } from '../models/mongo/cart';
import { Product } from '../models/mongo/product';
import { Order } from '../models/mongo/order';
import jwt from 'jsonwebtoken';

export const checkout = async (req: Request, res: Response): Promise<any> => {

  try {
    const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Unauthorized. No token provided.' });
        }
    
        const token = authHeader.split(' ')[1];
        console.log('Authorization Header:', req.headers.authorization);
        console.log('Token:', token);
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const userId = decoded.userId;

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let total = 0;
    const orderItems = cart.items.map((item) => {
        const product = item.productId as typeof Product.prototype;
        const price = product.price;
        total += price * item.quantity;
      
        return {
          productId: product._id,
          quantity: item.quantity,
          price,
        };
      });
      

    const order = await Order.create({
      userId,
      items: orderItems,
      total
    });

    
    await Cart.deleteOne({ userId });

    res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};
