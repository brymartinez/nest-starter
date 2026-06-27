import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';

import { DatabaseModule } from '../database/database.module';
import { AuthConfigFactory } from './auth-config.factory';

describe('AuthConfigFactory', () => {
  it('creates better-auth options from ConfigService', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          isGlobal: true,
          load: [
            () => ({
              BETTER_AUTH_SECRET: 'test-secret-test-secret-test-secret-test',
              BETTER_AUTH_URL: 'http://localhost:3000',
              DATABASE_URL:
                'postgres://postgres:postgres@localhost:5432/nest-starter',
              GOOGLE_CLIENT_ID: 'google-client-id',
              GOOGLE_CLIENT_SECRET: 'google-client-secret',
            }),
          ],
          skipProcessEnv: true,
        }),
        DatabaseModule,
      ],
      providers: [AuthConfigFactory],
    }).compile();

    const config = moduleRef.get(AuthConfigFactory).create();

    expect(config.baseURL).toBe('http://localhost:3000');
    expect(config.secret).toBe('test-secret-test-secret-test-secret-test');
    expect(config.user?.modelName).toBe('users');
    expect(config.session?.modelName).toBe('sessions');
    expect(config.account?.modelName).toBe('accounts');
    expect(config.verification?.modelName).toBe('verifications');
    expect(config.emailAndPassword).toEqual({ enabled: true });
    expect(config.socialProviders?.google).toEqual({
      clientId: 'google-client-id',
      clientSecret: 'google-client-secret',
    });
    expect(config.plugins).toHaveLength(2);

    await moduleRef.close();
  });

  it('requires BETTER_AUTH_URL', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          isGlobal: true,
          load: [
            () => ({
              BETTER_AUTH_SECRET: 'test-secret-test-secret-test-secret-test',
              DATABASE_URL:
                'postgres://postgres:postgres@localhost:5432/nest-starter',
              GOOGLE_CLIENT_ID: 'google-client-id',
              GOOGLE_CLIENT_SECRET: 'google-client-secret',
            }),
          ],
          skipProcessEnv: true,
        }),
        DatabaseModule,
      ],
      providers: [AuthConfigFactory],
    }).compile();

    expect(() => moduleRef.get(AuthConfigFactory).create()).toThrow(
      'BETTER_AUTH_URL',
    );

    await moduleRef.close();
  });
});
