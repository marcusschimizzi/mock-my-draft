import express, { Request, Response, Express } from 'express';
import DataStore from './data-store';
import loggerMiddleware from './middleware/logger';
import { initializeDatabase } from './database';

const app: Express = express();

const dataStore = new DataStore();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.get('/', (req: Request, res: Response) => {
  const grades = dataStore.getTeamAverages();
  if (grades) {
    res.status(200).json(grades);
    return;
  }
  res.json([]);
});

app.get('/teams/:teamId/responses', (req: Request, res: Response) => {
  const teamResponses = dataStore.getTeamResponsesById(req.params.teamId);
  if (teamResponses) {
    res.status(200).json(teamResponses);
    return;
  }
  res.status(404).json({ message: 'Team not found' });
});

app.get('/teams/:teamId', (req: Request, res: Response) => {
  const teamGrades = dataStore.getTeamAverageById(req.params.teamId);
  if (teamGrades) {
    res.status(200).json(teamGrades);
    return;
  }
  res.status(404).json({ message: 'Team not found' });
});

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
