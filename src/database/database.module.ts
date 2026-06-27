import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DATABASE } from './database';
import { DatabaseProvider } from './database.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    DatabaseProvider,
    {
      provide: DATABASE,
      useExisting: DatabaseProvider,
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
