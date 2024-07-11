import express from 'express';
import * as path from 'path';
import { config } from 'dotenv';
import 'reflect-metadata';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth-routes';
import teamsRoutes from './routes/teams-routes';

import { initializeDatabase } from './database';
import logger from './middleware/logger';

config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);

app.get('/api/health', (req, res) => {
  res.send({ status: 'OK' });
});

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to draft-api!' });
});
const port = process.env.PORT || 3333;

const startServer = async () => {
  await initializeDatabase();
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
