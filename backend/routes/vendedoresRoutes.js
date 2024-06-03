import express from 'express'
import { createSeller, deleteSeller, getSellerById, getSeller, updateSeller, getSellsBySeller } from '../controller/vendedoresCtrl.js'
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/', authMiddleware, createSeller);
router.get('/', getSeller);
router.get('/:id', getSellerById);
router.get('/:id/ventas' , getSellsBySeller);
router.put('/:id', authMiddleware, updateSeller);
router.delete('/:id', authMiddleware, deleteSeller);


export default router;