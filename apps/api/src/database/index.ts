import { DataSource } from 'typeorm';
import { Team } from './entities/team';

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Team],
  synchronize: true,
  logging: true,
  migrations: ['apps/api/src/database/migrations/*.ts'],
  subscribers: ['apps/api/src/database/subscribers/*.ts'],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized');
    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database', error);
    throw error;
  }
};
