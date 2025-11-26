const prisma = require('../database/prismaClient');

async function list(req, res, next) {
  try {
    const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });
    res.json(services);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return res.status(404).json({ message: 'service not found' });
    res.json(service);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name, price, durationMinutes } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'name and price required' });
    const service = await prisma.service.create({ data: { name, price, durationMinutes } });
    res.status(201).json(service);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.service.update({ where: { id }, data });
    res.json(updated);
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ message: 'service not found' });
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ message: 'service not found' });
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
