const { Router } = require("express");
const { createClient, getClients, getClientById, getClientsBySeller, getClientsToApprove, handleApproveClient, updateClient, deleteClient } = require("../controller/clientesCtrl.js");
const { authMiddleware, authorize }  = require("../middlewares/authMiddleware.js");


const router = Router();

router.post('/', authMiddleware, authorize('Administrador') ,  createClient);
router.get('/', getClients);
router.get('/vendedor/:id', authMiddleware, authorize('Vendedor'), getClientsBySeller);
router.get('/aprobar', authMiddleware, authorize('Administrador'), getClientsToApprove);
router.get('/:id', getClientById);
router.put('/aprobar/:id', authMiddleware, authorize('Administrador'), handleApproveClient);
router.put('/:id', authMiddleware , authorize('Administrador') ,updateClient);
router.delete('/:id', authMiddleware, authorize('Administrador'), deleteClient);

module.exports = router;
