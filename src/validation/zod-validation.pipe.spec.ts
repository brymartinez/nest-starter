import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import { updateUserProfileSchema } from '../users/update-user-profile.dto';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  it('returns parsed data for a valid payload', () => {
    const pipe = new ZodValidationPipe(updateUserProfileSchema);

    const result = pipe.transform(
      {
        name: '  Bryan  ',
        username: 'bryan_dev',
        displayUsername: '  Bryan Dev  ',
      },
      {
        type: 'body',
        metatype: Object,
      },
    );

    expect(result).toEqual({
      name: 'Bryan',
      username: 'bryan_dev',
      displayUsername: 'Bryan Dev',
    });
  });

  it('throws a bad request exception for an invalid payload', () => {
    const pipe = new ZodValidationPipe(updateUserProfileSchema);

    expect(() =>
      pipe.transform(
        {
          name: '   ',
          username: 'no spaces allowed',
        },
        {
          type: 'body',
          metatype: Object,
        },
      ),
    ).toThrow(BadRequestException);
  });
});
