import express from 'express';
import apiRouter from './routes/api.js';
import { connectDatabase } from './config/database.js';

export const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.use((_request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-api' });
});

app.use('/api', apiRouter);

const server = app.listen(port, () => {
  console.log(`OctoFit API listening at ${apiBaseUrl}`);
});

connectDatabase().catch((error) => {
  console.error('Database unavailable:', error instanceof Error ? error.message : error);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});