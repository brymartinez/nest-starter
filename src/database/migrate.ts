import { promises as fs } from 'node:fs';
import path from 'node:path';

import { FileMigrationProvider, type Kysely, Migrator } from 'kysely';

import type { DatabaseSchema } from './database';

export function createMigrator(db: Kysely<DatabaseSchema>): Migrator {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.resolve(process.cwd(), 'src/database/migrations'),
    }),
  });
}

export async function migrateToLatest(
  db: Kysely<DatabaseSchema>,
): Promise<void> {
  const { error } = await createMigrator(db).migrateToLatest();

  if (error) {
    throw error;
  }
}
