import { Router } from "express";
import { createClient, getClients, getClientById, getClientsToApprove, handleApproveClient, updateClient, deleteClient } from "../controller/clientesCtrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = Router();

router.post('/', authMiddleware, createClient);
router.get('/', getClients);
router.get('/aprobar', authMiddleware, getClientsToApprove);
router.get('/:id', getClientById);
router.put('/aprobar/:id', authMiddleware, handleApproveClient);
router.put('/:id', authMiddleware ,updateClient);
router.delete('/:id', authMiddleware, deleteClient);

export default router;
