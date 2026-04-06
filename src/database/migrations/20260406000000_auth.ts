import { type Kysely, sql } from 'kysely';

import type { DatabaseSchema } from '../database';

export async function up(db: Kysely<DatabaseSchema>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('emailVerified', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn('image', 'text')
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('username', 'text', (col) => col.unique())
    .addColumn('displayUsername', 'text')
    .execute();

  await db.schema
    .createTable('sessions')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('expiresAt', 'timestamptz', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull().unique())
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'timestamptz', (col) => col.notNull())
    .addColumn('ipAddress', 'text')
    .addColumn('userAgent', 'text')
    .addColumn('userId', 'text', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .execute();
  await db.schema
    .createIndex('sessions_userId_idx')
    .on('sessions')
    .column('userId')
    .execute();

  await db.schema
    .createTable('accounts')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('accountId', 'text', (col) => col.notNull())
    .addColumn('providerId', 'text', (col) => col.notNull())
    .addColumn('userId', 'text', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('accessToken', 'text')
    .addColumn('refreshToken', 'text')
    .addColumn('idToken', 'text')
    .addColumn('accessTokenExpiresAt', 'timestamptz')
    .addColumn('refreshTokenExpiresAt', 'timestamptz')
    .addColumn('scope', 'text')
    .addColumn('password', 'text')
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'timestamptz', (col) => col.notNull())
    .execute();
  await db.schema
    .createIndex('accounts_userId_idx')
    .on('accounts')
    .column('userId')
    .execute();

  await db.schema
    .createTable('verifications')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('value', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'timestamptz', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();
  await db.schema
    .createIndex('verifications_identifier_idx')
    .on('verifications')
    .column('identifier')
    .execute();

  await db.schema
    .createTable('ssoProviders')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('issuer', 'text', (col) => col.notNull())
    .addColumn('oidcConfig', 'text')
    .addColumn('samlConfig', 'text')
    .addColumn('userId', 'text', (col) =>
      col.references('users.id').onDelete('cascade'),
    )
    .addColumn('providerId', 'text', (col) => col.notNull().unique())
    .addColumn('organizationId', 'text')
    .addColumn('domain', 'text', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<DatabaseSchema>): Promise<void> {
  await db.schema.dropTable('ssoProviders').ifExists().execute();
  await db.schema.dropTable('verifications').ifExists().execute();
  await db.schema.dropTable('accounts').ifExists().execute();
  await db.schema.dropTable('sessions').ifExists().execute();
  await db.schema.dropTable('users').ifExists().execute();
}
