import { describe, expect, it } from 'vitest';

import { buildAuthConfig } from './auth.config';

describe('buildAuthConfig', () => {
  it('includes google, username/password, and sso settings when env is present', () => {
    const config = buildAuthConfig({
      BETTER_AUTH_URL: 'http://localhost:3000',
      BETTER_AUTH_SECRET: 'test-secret-test-secret-test-secret-test',
      DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/nest-starter',
      GOOGLE_CLIENT_ID: 'google-client-id',
      GOOGLE_CLIENT_SECRET: 'google-client-secret'
    });

    expect(config.baseURL).toBe('http://localhost:3000');
    expect(config.secret).toBe('test-secret-test-secret-test-secret-test');
    expect(config.emailAndPassword).toEqual({ enabled: true });
    expect(config.socialProviders?.google).toEqual({
      clientId: 'google-client-id',
      clientSecret: 'google-client-secret'
    });
    expect(config.plugins).toHaveLength(2);
  });
});
