import { Request, Response } from 'express';
import { Cart } from '../models/mongo/cart';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
  }

export const getCart = async (req: Request, res: Response): Promise<any> => {
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
    res.json(cart || { userId, items: [] });
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
  }
};



export const addToCart = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
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

    console.log('Decoded User ID:', userId);

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required.' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    if(err instanceof Error) {
    console.error('Add to cart error:', err);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
    }
}else {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add to cart.' });
  }
}
}
    


export const removeFromCart = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      const userId = decoded.userId;
  
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required.' });
      }
  
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
  
      const updatedItems = cart.items.filter(item => item.productId.toString() !== productId);
      cart.set('items', updatedItems);
      await cart.save();
  
      res.json(cart);
    } catch (err) {
        if(err instanceof Error) {
      console.error('Remove from cart error:', err);
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
      }
      res.status(500).json({ error: 'Failed to remove from cart.' });
    }else{
        console.error('Remove from cart error:', err);
        res.status(500).json({ error: 'Failed to remove from cart.' });     
    }
}
  };
  

export const clearCart = async (userId: string) => {
  await Cart.findOneAndUpdate({ userId }, { items: [] });
}
