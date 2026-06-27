import { sso } from '@better-auth/sso';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { BetterAuthOptions } from 'better-auth';
import { username } from 'better-auth/plugins';
import type { Kysely } from 'kysely';

import { DATABASE, type DatabaseSchema } from '../database/database';

@Injectable()
export class AuthConfigFactory {
  constructor(
    private readonly configService: ConfigService,
    @Inject(DATABASE)
    private readonly db: Kysely<DatabaseSchema>,
  ) {}

  create(): BetterAuthOptions {
    const baseURL = this.configService.getOrThrow<string>('BETTER_AUTH_URL');
    const secret =
      this.configService.get<string>('BETTER_AUTH_SECRET') ??
      this.configService.get<string>('AUTH_SECRET');
    const google = this.getGoogleProviderConfig();

    if (!secret) {
      throw new Error('BETTER_AUTH_SECRET or AUTH_SECRET is required');
    }

    return {
      baseURL,
      secret,
      user: {
        modelName: 'users',
      },
      session: {
        modelName: 'sessions',
      },
      account: {
        modelName: 'accounts',
      },
      verification: {
        modelName: 'verifications',
      },
      database: {
        db: this.db,
        type: 'postgres',
      },
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        google,
      },
      plugins: [username(), sso({ modelName: 'ssoProviders' })],
    };
  }

  private getGoogleProviderConfig(): {
    clientId: string;
    clientSecret: string;
  } {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required');
    }

    return { clientId, clientSecret };
  }
}
