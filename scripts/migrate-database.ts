import { NestFactory } from '@nestjs/core';
import type { Kysely } from 'kysely';

import type { DatabaseSchema } from '../src/database/database';
import { DATABASE } from '../src/database/database.constants';
import { DatabaseMigrationModule } from '../src/database/database-migration.module';
import { migrateToLatest } from '../src/database/migrate';

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(
    DatabaseMigrationModule,
  );
  const db = app.get<Kysely<DatabaseSchema>>(DATABASE);

  try {
    await migrateToLatest(db);
  } finally {
    await app.close();
  }
}

void main();
