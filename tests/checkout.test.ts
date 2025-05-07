import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app'; // Express app
import { Cart } from '../src/models/mongo/cart';
import { Product } from '../src/models/mongo/product';
import User from '../src/models/mongo/userModel';
import jwt from 'jsonwebtoken';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
    const db = mongoose.connection.db;
    if (!db) throw new Error('Mongoose DB is undefined');
    
    const collections = await db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });
  

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

const createTestUserAndToken = async () => {
  const user = new User({ email: 'test@example.com', password: 'password123' });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '1h',
  });

  return { user, token };
};

describe('POST /api/orders/checkout', () => {
  it('should place an order and clear the cart', async () => {
    const { user, token } = await createTestUserAndToken();

    const product = new Product({
      name: 'Test Product',
      price: 100,
      stock: 10,
    });
    await product.save();

    const cart = new Cart({
      userId: user._id, 
      items: [{ productId: product._id, quantity: 2 }],
    });
    await cart.save();

    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(201); 
    expect(res.body.message).toMatch(/order placed/i);

    const updatedCart = await Cart.findOne({ userId: user._id });
    expect(updatedCart).toBeNull();
  });

  it('should return error when cart is empty', async () => {
    const { user, token } = await createTestUserAndToken();

    const emptyCart = new Cart({
      userId: user._id,
      items: [],
    });
    await emptyCart.save();

    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/cart is empty/i); 
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post('/api/orders/checkout').send();

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/unauthorized|token/i); 
  });
});
