import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { DatabaseSchema } from './database';

@Injectable()
export class DatabaseProvider
  extends Kysely<DatabaseSchema>
  implements OnModuleDestroy
{
  constructor(configService: ConfigService) {
    super({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
        }),
      }),
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.destroy();
  }
}
