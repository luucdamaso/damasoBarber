const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', clientsController.list);
router.get('/:id', clientsController.getById);
router.post('/', clientsController.create);
router.put('/:id', clientsController.update);
router.delete('/:id', clientsController.remove);

module.exports = router;
