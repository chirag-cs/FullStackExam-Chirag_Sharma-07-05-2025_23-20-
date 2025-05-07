import { Request, Response } from 'express';
import { Product } from '../models/mongo/product';

export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const { search = '', category = '', page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Product.countDocuments(filter);

    res.json({ data: products, total, page: +page, limit: +limit });
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
  }
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
  }
};

export const getProductCategorySummary = async (_req: Request, res: Response): Promise<any> => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      }
    ]);
    res.json(summary);
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
  }
};
