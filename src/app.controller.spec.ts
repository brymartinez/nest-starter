import { describe, expect, it } from 'vitest';

import { AppController } from './app.controller';

describe('AppController', () => {
  it('returns the starter message', () => {
    const controller = new AppController();

    expect(controller.getHello()).toBe('Hello World!');
  });
});
