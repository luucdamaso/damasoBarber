const prisma = require('../database/prismaClient');

async function list(req, res, next) {
  try {
    const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } });
    res.json(clients);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return res.status(404).json({ message: 'client not found' });
    res.json(client);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name, phone, email, notes } = req.body;
    if (!name || !phone) return res.status(400).json({ message: 'name and phone required' });
    const client = await prisma.client.create({ data: { name, phone, email, notes } });
    res.status(201).json(client);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { name, phone, email, notes } = req.body;
    const client = await prisma.client.update({
      where: { id },
      data: { name, phone, email, notes }
    });
    res.json(client);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.client.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    if (err?.code === 'P2025') {
      return res.status(404).json({ message: 'client not found' });
    }
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
