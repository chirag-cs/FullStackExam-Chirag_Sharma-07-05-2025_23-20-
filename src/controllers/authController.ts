import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail, findUserById } from '../models/sql/User';
import e from 'cors';

const SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) :Promise<any>  => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (user) return res.status(400).json({ error: 'User already exists' });

  await createUser(email, password);
  res.status(201).json({ message: 'User created' });
};

export const login = async (req: Request, res: Response): Promise<any>  => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ error: 'User Not Found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1d' });
  res.json({ token, email: user.email, userId: user.id });
};


export const getCurrentUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, SECRET) as { userId: number };
  
      const user = await findUserById(decoded.userId); 
  
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.json({ id: user.id, email: user.email });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
  