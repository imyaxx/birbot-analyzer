import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyze.js';

dotenv.config();

const { PORT, CORS_ORIGIN } = process.env;

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN ?? 'http://localhost:3000',
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/analyze', analyzeRoutes);

function start() {
  const port = Number(PORT) || 4000;
  app.listen(port, () => {
    console.log(`API listening on :${port}`);
  });
}

start();
