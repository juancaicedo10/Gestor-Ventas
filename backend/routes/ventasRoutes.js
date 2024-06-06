import express from 'express'
import { createSale, deleteSale, getSaleById, getAllSales, updateSale, abonoCuota, getAllSalesByVendedor } from '../controller/ventasCtrl.js'

const router = express.Router()

router.post('/', createSale);
router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.get('/vendedor/:id', getAllSalesByVendedor);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);
router.post('/abono', abonoCuota);

export default router;