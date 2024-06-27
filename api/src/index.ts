import express, { Request, Response, Express } from 'express';

const app: Express = express();
const port = process.env.PORT || 8008;

console.log(port);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Howdy there!' });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running on port: ${port}`);
});
