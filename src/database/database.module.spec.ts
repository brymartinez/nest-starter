import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { DATABASE } from './database';
import { DatabaseModule } from './database.module';

describe('DatabaseModule', () => {
  it('provides a database instance from ConfigService', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          isGlobal: true,
          load: [
            () => ({
              DATABASE_URL:
                'postgres://postgres:postgres@localhost:5432/nest-starter',
            }),
          ],
          skipProcessEnv: true,
        }),
        DatabaseModule,
      ],
    }).compile();

    const db = moduleRef.get(DATABASE);

    expect(db).toBeDefined();
    await moduleRef.close();
  });

  it('requires DATABASE_URL', async () => {
    await expect(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            ignoreEnvFile: true,
            isGlobal: true,
            skipProcessEnv: true,
          }),
          DatabaseModule,
        ],
      }).compile(),
    ).rejects.toThrow('DATABASE_URL');
  });
});
