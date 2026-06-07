import {
  DataSource,
  DefaultNamingStrategy,
  NamingStrategyInterface,
} from 'typeorm';
import { join } from 'path';
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
import { DataVersion } from './models/data-version';
import { DataImportLog } from './models/data-import-log';
import { DraftSession } from './models/draft-session';
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

// Resolve migration/subscriber globs relative to this file so they work both
// under ts-node (src/**/*.ts) and from the compiled build (dist/**/*.js).
const migrationsGlob = join(__dirname, 'migrations', '*.{ts,js}');
const subscribersGlob = join(__dirname, 'subscribers', '*.{ts,js}');

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
    DataVersion,
    DataImportLog,
    DraftSession,
  ],
  // Schema is managed by migrations. Leave synchronize off; set DB_SYNCHRONIZE=true
  // only for throwaway local experiments where you don't care about the schema.
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: true,
  migrations: [migrationsGlob],
  subscribers: [subscribersGlob],
  namingStrategy: new SnakeNamingStrategy(),
});

// Pending migrations run automatically on startup. Set RUN_MIGRATIONS=false to
// disable (e.g. when migrations are applied as a separate deploy/release step).
const shouldRunMigrations = process.env.RUN_MIGRATIONS !== 'false';

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized');

    if (shouldRunMigrations) {
      const executed = await AppDataSource.runMigrations();
      console.log(
        executed.length
          ? `Ran ${executed.length} migration(s): ${executed
              .map((migration) => migration.name)
              .join(', ')}`
          : 'No pending migrations',
      );
    }

    await initAdmin();

    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
