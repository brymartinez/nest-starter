import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';

import { AppController } from './app.controller';
import { AuthConfigFactory } from './auth/auth-config.factory';
import { AuthConfigModule } from './auth/auth-config.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRootAsync({
      imports: [AuthConfigModule],
      inject: [AuthConfigFactory],
      disableGlobalAuthGuard: true,
      useFactory: (authConfigFactory: AuthConfigFactory) => ({
        auth: betterAuth(authConfigFactory.create()),
      }),
    }),
  ],
  controllers: [AppController, UsersController],
})
export class AppModule {}
