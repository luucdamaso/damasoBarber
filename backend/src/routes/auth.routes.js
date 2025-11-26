const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register', authController.register); 
router.post('/login', authController.login);
router.get('/me', authenticate, (req, res) => {
  return res.json({ user: req.user });
});
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
