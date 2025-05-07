import { pool } from '../sql/db'; 
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';


export const createUser = async (email: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  const res = await pool.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashed]
  );
  return res;
};

export const findUserByEmail = async (email: string) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  };

  export const findUserById = async (id: number) => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, email FROM users WHERE id = ?', [id]);
    return rows[0];
  };
  