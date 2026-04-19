import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AuthGuard, Session } from '@thallesp/nestjs-better-auth';

import {
  type UpdateUserProfileDto,
  updateUserProfileSchema,
} from './users/update-user-profile.dto';
import { ZodValidationPipe } from './validation/zod-validation.pipe';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  @Get('me')
  getMe(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Post('profile')
  updateProfile(
    @Body(new ZodValidationPipe(updateUserProfileSchema))
    profile: UpdateUserProfileDto,
    @Session() session: UserSession,
  ) {
    return {
      user: session.user,
      profile,
    };
  }
}
