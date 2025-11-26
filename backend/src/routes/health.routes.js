const { Router } = require('express');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/health', authenticate, (req, res) => {
  return res.json({
    status: 'OK',
    user: req.user
  });
});

router.post('/health', (req, res) => {
  return res.json({ received: req.body });
});

module.exports = router;
