import { DataSource } from 'typeorm';
import { User } from './models/user';

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  synchronize: true,
  logging: true,
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized');

    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
