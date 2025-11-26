const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const clientRoutes = require('./clientes.routes');
const bookingRoutes = require('./bookings.routes');

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router;
