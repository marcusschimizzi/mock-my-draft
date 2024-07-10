import { DataSource } from 'typeorm';
import { Team } from './entities/team';
import { User } from './entities/user';
import { initializeAdministrator } from '../utils/adminInit';
import { Source } from './entities/source';

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Team, User, Source],
  synchronize: true,
  logging: true,
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized');

    await initializeAdministrator();
    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database', error);
    throw error;
  }
};
