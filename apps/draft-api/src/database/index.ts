import {
  DataSource,
  DefaultNamingStrategy,
  NamingStrategyInterface,
} from 'typeorm';
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
import { DraftPickTrade } from './models/draft-pick-trade';
import { snakeCase } from 'typeorm/util/StringUtils';

class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return snakeCase(
      embeddedPrefixes.concat(customName || propertyName).join('_'),
    );
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(tableName + '_' + (columnName || propertyName));
  }
}

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
    DraftPickTrade,
  ],
  synchronize: true,
  logging: true,
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
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
