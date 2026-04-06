import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';

import { AppController } from './app.controller';
import { auth } from './auth/auth';
import { UsersController } from './users.controller';

@Module({
  imports: [AuthModule.forRoot({ auth, disableGlobalAuthGuard: true })],
  controllers: [AppController, UsersController]
})
export class AppModule {}
