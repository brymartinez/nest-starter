import {
  type ColumnType,
  type Generated,
  Kysely,
  PostgresDialect,
} from 'kysely';
import { Pool } from 'pg';

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface DatabaseSchema {
  users: {
    id: Generated<string>;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    username: string | null;
    displayUsername: string | null;
  };
  sessions: {
    id: Generated<string>;
    expiresAt: Timestamp;
    token: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;
  };
  accounts: {
    id: Generated<string>;
    accountId: string;
    providerId: string;
    userId: string;
    accessToken: string | null;
    refreshToken: string | null;
    idToken: string | null;
    accessTokenExpiresAt: Timestamp | null;
    refreshTokenExpiresAt: Timestamp | null;
    scope: string | null;
    password: string | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
  verifications: {
    id: Generated<string>;
    identifier: string;
    value: string;
    expiresAt: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
  ssoProviders: {
    id: Generated<string>;
    issuer: string;
    oidcConfig: string | null;
    samlConfig: string | null;
    userId: string | null;
    providerId: string;
    organizationId: string | null;
    domain: string;
  };
}

type DatabaseEnv = NodeJS.ProcessEnv;

function requireEnv(env: DatabaseEnv, key: string): string {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function createDatabase(env: DatabaseEnv): Kysely<DatabaseSchema> {
  return new Kysely<DatabaseSchema>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: requireEnv(env, 'DATABASE_URL') }),
    }),
  });
}
