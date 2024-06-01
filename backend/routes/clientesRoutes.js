import express from 'express'
import { createSeller, deleteSeller, getSellerById, getSeller, updateSeller } from '../controller/vendedoresCtrl.js'

const router = express.Router()

router.post('/', createSeller);
router.get('/', getSeller);
router.get('/:id', getSellerById);
router.put('/:id', updateSeller);
router.delete('/:id', deleteSeller);


export default router