import express from 'express';                  
import { login } from '../controller/sesionCtrls/loginCtrl.js';

const router = express.Router();

router.post('/', login)

export default router;