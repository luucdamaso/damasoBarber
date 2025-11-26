const prisma = require('../database/prismaClient');
const bookingService = require('../services/booking.service');

function parseISO(dateString) {
  // helper to convert ISO or datetime strings to Date
  return new Date(dateString);
}

async function listByDate(req, res, next) {
  try {
    const { date } = req.query; // expected YYYY-MM-DD
    if (!date) return res.status(400).json({ message: 'date query required, format YYYY-MM-DD' });

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const bookings = await prisma.booking.findMany({
      where: {
        start: { gte: startOfDay, lte: endOfDay }
      },
      include: { client: true },
      orderBy: { start: 'asc' }
    });

    res.json(bookings);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { clientId, start, end, service } = req.body;
    if (!clientId || !start || !end || !service) return res.status(400).json({ message: 'clientId, start, end and service are required' });

    const startDate = parseISO(start);
    const endDate = parseISO(end);
    if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
      return res.status(400).json({ message: 'invalid start/end dates' });
    }

    // check conflict
    const conflicting = await bookingService.hasConflict(startDate, endDate);
    if (conflicting) return res.status(409).json({ message: 'conflict with existing booking' });

    const booking = await prisma.booking.create({
      data: {
        clientId,
        start: startDate,
        end: endDate,
        service,
        status: 'scheduled'
      },
      include: { client: true }
    });

    res.status(201).json(booking);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { clientId, start, end, service, status } = req.body;

    const data = {};
    if (clientId) data.clientId = clientId;
    if (service) data.service = service;
    if (status) data.status = status;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
        return res.status(400).json({ message: 'invalid start/end dates' });
      }
      // check conflict excluding this booking
      const conflicting = await bookingService.hasConflict(startDate, endDate, id);
      if (conflicting) return res.status(409).json({ message: 'conflict with existing booking' });
      data.start = startDate;
      data.end = endDate;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data,
      include: { client: true }
    });

    res.json(updated);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    // soft-delete could be implemented; here we delete
    await prisma.booking.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { listByDate, create, update, remove };
