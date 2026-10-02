import { Test } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { UsersController } from './users.controller';

describe('AppModule', () => {
  beforeEach(() => {
    vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000');
    vi.stubEnv(
      'BETTER_AUTH_SECRET',
      'test-secret-test-secret-test-secret-test',
    );
    vi.stubEnv(
      'DATABASE_URL',
      'postgres://postgres:postgres@localhost:5432/nest-starter',
    );
    vi.stubEnv('GOOGLE_CLIENT_ID', 'google-client-id');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'google-client-secret');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('wires the controllers and the Better Auth module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    expect(app.get(AppController)).toBeInstanceOf(AppController);
    expect(app.get(UsersController)).toBeInstanceOf(UsersController);

    await app.close();
  });
});
