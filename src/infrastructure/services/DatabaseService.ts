import { injectable } from 'inversify';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { IDatabaseService } from '../../core/ports/services/IDatabaseService';
import schema from '../database/schema';
import { UserModel } from '../database/UserModel';

@injectable()
export class DatabaseService implements IDatabaseService {
  private database: Database;

  constructor() {
    const adapter = new SQLiteAdapter({
      schema,
      dbName: 'fnb_database',
    });

    this.database = new Database({
      adapter,
      modelClasses: [UserModel],
    });
  }

  getDatabase(): Database {
    return this.database;
  }

  async initializeDatabase(): Promise<void> {
    // Database is automatically initialized when created
    console.log('Database initialized');
  }
}
