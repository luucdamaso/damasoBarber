const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const clientRoutes = require('./clientes.routes');
const bookingRoutes = require('./bookings.routes');
const healthRoutes = require('./health.routes');
const servicesRoutes = require('./services.routes');

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/bookings', bookingRoutes);
router.use('/services', servicesRoutes);

module.exports = router;
