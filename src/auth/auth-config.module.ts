import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '../database/database.module';
import { AuthConfigFactory } from './auth-config.factory';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [AuthConfigFactory],
  exports: [AuthConfigFactory],
})
export class AuthConfigModule {}
