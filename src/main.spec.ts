import { afterEach, describe, expect, it, vi } from 'vitest';

const listen = vi.fn();
const create = vi.fn(async () => ({
  listen
}));

vi.mock('./auth/auth', () => ({
  auth: {}
}));

vi.mock('@nestjs/core', () => ({
  NestFactory: {
    create
  }
}));

describe('bootstrap', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates the app with body parser disabled', async () => {
    await import('./main');

    expect(create).toHaveBeenCalledWith(expect.anything(), {
      bodyParser: false
    });
  });
});
