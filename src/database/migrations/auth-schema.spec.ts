import { newDb } from 'pg-mem';
import { describe, expect, it } from 'vitest';

import { down, up } from './20260406000000_auth';

describe('auth schema migration', () => {
  it('creates and drops the Better Auth tables', async () => {
    const memDb = newDb();
    const db = memDb.adapters.createKysely();

    await up(db);

    expect(memDb.getTable('users', true)).not.toBeNull();
    expect(memDb.getTable('sessions', true)).not.toBeNull();
    expect(memDb.getTable('accounts', true)).not.toBeNull();
    expect(memDb.getTable('verifications', true)).not.toBeNull();
    expect(memDb.getTable('ssoProviders', true)).not.toBeNull();

    await down(db);

    expect(memDb.getTable('users', true)).toBeNull();
  });
});
