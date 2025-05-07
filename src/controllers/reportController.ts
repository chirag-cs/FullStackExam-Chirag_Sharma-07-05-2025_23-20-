import { Request, Response } from 'express';
import { Order } from '../models/mongo/order';
import { Product } from '../models/mongo/product';

export const getDailyRevenue = async (req: Request, res: Response) => {
  try {
    const revenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$total" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daily revenue' });
  }
};

export const getSalesByCategory = async (req: Request, res: Response) => {
  try {
    const categorySales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { totalSold: -1 } }
    ]);

    res.json(categorySales);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category sales report' });
  }
};
