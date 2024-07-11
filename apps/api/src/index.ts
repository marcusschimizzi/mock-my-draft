import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import 'reflect-metadata';
import loggerMiddleware from './middleware/logger';
import { initializeDatabase } from './database';
import teamRouter from './routes/teams';
import authRouter from './routes/auth';
import sourceRouter from './routes/source-router';

const app: Express = express();
config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(loggerMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Nope, nothing to see here.' });
});

app.use('/teams', teamRouter);
app.use('/sources', sourceRouter);
app.use('/auth', authRouter);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

const startServer = async () => {
  await initializeDatabase();

  const port = process.env.PORT || 8008;

  app.listen(port, () => {
    console.log(`[server]: Server is running on port: ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Error starting server', error);
  process.exit(1);
});
