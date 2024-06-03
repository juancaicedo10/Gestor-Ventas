import express from 'express'
import { createSale, deleteSale, getSaleById, getAllSales, updateSale, abonoCuota } from '../controller/ventasCtrl.js'

const router = express.Router()

router.post('/', createSale);
router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);
router.post('/abono', abonoCuota);

export default router;