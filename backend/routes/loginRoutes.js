const express = require('express');                
const { login } = require('../controller/sesionCtrls/loginCtrl.js');

const router = express.Router();

router.post('/', login)

module.exports = router;