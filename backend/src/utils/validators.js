function required(fields, body) {
  const missing = fields.filter(f => !(f in body));
  if (missing.length) {
    const err = new Error(`missing fields: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
  }
  return true;
}

module.exports = { required };
