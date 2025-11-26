const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// query ?date=YYYY-MM-DD  (returns bookings for that date)
router.get('/', bookingsController.listByDate);
router.post('/', bookingsController.create);
router.put('/:id', bookingsController.update);
router.delete('/:id', bookingsController.remove);

module.exports = router;
