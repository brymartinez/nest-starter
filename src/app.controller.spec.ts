import { describe, expect, it } from 'vitest';

import { AppController } from './app.controller';

describe('AppController', () => {
  it('is marked as allowing anonymous access', () => {
    expect(Reflect.getMetadata('PUBLIC', AppController)).toBe(true);
  });
});
