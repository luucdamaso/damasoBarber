const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/services.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/admin.middleware'); 

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, ctrl.create);
router.put('/:id', authenticate, ctrl.update);
router.delete('/:id', authenticate, requireAdmin, ctrl.remove); 

module.exports = router;
