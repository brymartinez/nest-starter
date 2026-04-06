import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

import type { BetterAuthOptions } from 'better-auth';
import { username } from 'better-auth/plugins';
import { sso } from '@better-auth/sso';

type AuthEnv = NodeJS.ProcessEnv;

function requireEnv(env: AuthEnv, key: string): string {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function requireGoogleEnv(env: AuthEnv): { clientId: string; clientSecret: string } {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required');
  }

  return { clientId, clientSecret };
}

export function buildAuthConfig(env: AuthEnv): BetterAuthOptions {
  const databaseUrl = requireEnv(env, 'DATABASE_URL');
  const baseURL = requireEnv(env, 'BETTER_AUTH_URL');
  const secret = env.BETTER_AUTH_SECRET ?? env.AUTH_SECRET;

  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET or AUTH_SECRET is required');
  }

  const google = requireGoogleEnv(env);

  return {
    baseURL,
    secret,
    database: {
      db: new Kysely({
        dialect: new PostgresDialect({
          pool: new Pool({ connectionString: databaseUrl })
        })
      }),
      type: 'postgres'
    },
    emailAndPassword: {
      enabled: true
    },
    socialProviders: {
      google
    },
    plugins: [username(), sso()]
  };
}
