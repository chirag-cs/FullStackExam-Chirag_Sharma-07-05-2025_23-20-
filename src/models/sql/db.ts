import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();



export const pool = mysql.createPool({
  host: process.env.SQL_HOST || 'localhost',
  user: process.env.SQL_USER || 'root',
  password: process.env.SQL_PASSWORD || '',
  database: process.env.SQL_DB || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


export const sequelize = new Sequelize(
  process.env.SQL_DB as string,
  process.env.SQL_USER as string,
  process.env.SQL_PASSWORD as string,
  {
    host: process.env.SQL_HOST,
    dialect: "mysql", // or "mysql"
    logging: false,
  }
);

export const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to SQL database");
  } catch (err) {
    console.error("SQL DB connection error:", err);
    process.exit(1);
  }
};
