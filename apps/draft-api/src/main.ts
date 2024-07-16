import express from 'express';
import * as path from 'path';
import { config } from 'dotenv';
import 'reflect-metadata';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth-routes';
import teamsRoutes from './routes/teams-routes';
import sourcesRoutes from './routes/sources-routes';
import sourceArticlesRoutes from './routes/source-articles';

import { initializeDatabase } from './database';
import logger from './middleware/logger';
import { errorHandler } from './middleware/error-handler.middleware';

config();
const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

console.log('Allowed origins:', allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to draft-api!' });
});
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/sources', sourcesRoutes);
app.use('/api/source-articles', sourceArticlesRoutes);

app.get('/api/health', (req, res) => {
  res.send({ status: 'OK' });
});

app.use(errorHandler);
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
