const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register); // opcional
router.post('/login', authController.login);

module.exports = router;
