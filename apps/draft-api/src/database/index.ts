import { DataSource } from 'typeorm';
import { User } from './models/user';
import { initAdmin } from './utils/initAdmin';
import { Team } from './models/team';
import { Source } from './models/source';
import { Player } from './models/player';

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Team, Source, Player],
  synchronize: true,
  logging: true,
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized');

    await initAdmin();

    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
