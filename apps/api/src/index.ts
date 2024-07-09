import express, { Request, Response, Express } from 'express';
import loggerMiddleware from './middleware/logger';
import { initializeDatabase } from './database';
import teamRouter from './routes/teams';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.use('/teams', teamRouter);

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
