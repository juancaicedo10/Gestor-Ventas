const express = require('express');
const { createSeller, deleteSeller, getSellerById, getSeller, updateSeller, getSellsBySeller } = require('../controller/vendedoresCtrl.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');

const router = express.Router()

router.post('/', authMiddleware, createSeller);
router.get('/', getSeller);
router.get('/:id', getSellerById);
router.get('/:id/ventas' , getSellsBySeller);
router.put('/:id', authMiddleware, updateSeller);
router.delete('/:id', authMiddleware, deleteSeller);


module.exports = router;