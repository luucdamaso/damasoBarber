require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();
app.use(cors());
app.use(express.json());

const jsonError = require('./middlewares/jsonError.middleware');
app.use(jsonError);

const logger = require('./middlewares/logger.middleware');
app.use(logger);

app.use('/api', routes);

// health
app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
