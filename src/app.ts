
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import reportRoutes from './routes/reportRoutes';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

app.get("/", (_req, res) => {
  res.send("E-Commerce API is running");
});

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, '../frontend/out')));

app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/out/index.html'));
  });


export default app;
