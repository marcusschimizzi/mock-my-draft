import { DataSource } from 'typeorm';
import { User } from './models/user';
import { initAdmin } from './utils/initAdmin';
import { Team } from './models/team';
import { Source } from './models/source';
import { Player } from './models/player';
import { DraftClassGrade } from './models/draft-class-grade';
import { DraftPick } from './models/draft-pick';
import { SourceArticle } from './models/source-article';
import { PlayerGrade } from './models/player-grade';
import { PlayerRanking } from './models/player-ranking';

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    User,
    Team,
    Source,
    Player,
    DraftClassGrade,
    DraftPick,
    SourceArticle,
    PlayerGrade,
    PlayerRanking,
    DraftClassGrade,
  ],
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
