import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductCategorySummary
} from '../controllers/productController';

const router = express.Router();

router.get('/', getAllProducts); 
router.get('/summary', getProductCategorySummary); 
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
