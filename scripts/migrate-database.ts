import { createDatabase } from '../src/database/database';
import { migrateToLatest } from '../src/database/migrate';

async function main(): Promise<void> {
  const db = createDatabase(process.env);

  try {
    await migrateToLatest(db);
  } finally {
    await db.destroy();
  }
}

void main();
