const prisma = require('../database/prismaClient');

/**
 * Check for booking conflict.
 * Returns true if conflict exists.
 * If excludeBookingId provided, excludes that ID from the search (useful when updating).
 */
async function hasConflict(startDate, endDate, excludeBookingId = null) {
  // overlap condition: existing.start < endDate AND existing.end > startDate
  const where = {
    AND: [
      { start: { lt: endDate } },
      { end: { gt: startDate } }
    ]
  };

  if (excludeBookingId) {
    where.AND.push({ id: { not: excludeBookingId } });
  }

  const existing = await prisma.booking.findFirst({ where });
  return !!existing;
}

module.exports = { hasConflict };
