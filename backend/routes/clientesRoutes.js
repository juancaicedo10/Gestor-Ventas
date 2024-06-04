import { Router } from "express";
import { createClient, getClients, getClientById, getClientsBySeller, getClientsToApprove, handleApproveClient, updateClient, deleteClient } from "../controller/clientesCtrl.js";
import { authMiddleware, authorize } from "../middlewares/authMiddleware.js";


const router = Router();

router.post('/', authMiddleware, authorize('Administrador') ,  createClient);
router.get('/', getClients);
router.get('/vendedor/:id', authMiddleware, authorize('Vendedor'), getClientsBySeller);
router.get('/aprobar', authMiddleware, authorize('Administrador'), getClientsToApprove);
router.get('/:id', getClientById);
router.put('/aprobar/:id', authMiddleware, authorize('Administrador'), handleApproveClient);
router.put('/:id', authMiddleware , authorize('Administrador') ,updateClient);
router.delete('/:id', authMiddleware, authorize('Administrador'), deleteClient);

export default router;
