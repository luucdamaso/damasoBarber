const jwt = require('jsonwebtoken');
const prisma = require('../database/prismaClient');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

async function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'authorization required' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // optionally fetch user
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ message: 'user not found' });
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'invalid token' });
  }
}

module.exports = { authenticate };
