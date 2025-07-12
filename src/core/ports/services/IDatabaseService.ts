import { Database } from '@nozbe/watermelondb';

export interface IDatabaseService {
  getDatabase(): Database;
  initializeDatabase(): Promise<void>;
}
