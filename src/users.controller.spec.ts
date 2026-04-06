import { GUARDS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';

import { UsersController } from './users.controller';

describe('UsersController', () => {
  it('uses the Better Auth guard at the controller level', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, UsersController) as
      | Array<unknown>
      | undefined;

    expect(guards?.length).toBeGreaterThan(0);
  });
});
