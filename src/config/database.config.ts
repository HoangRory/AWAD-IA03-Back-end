import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

// Load environment variables from .env (if present)
dotenv.config();

const env = process.env;

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  // If a full DATABASE_URL is provided, prefer that (useful for hosted DBs)
  ...(env.DATABASE_URL
    ? { url: env.DATABASE_URL }
    : {
        host: env.DB_HOST ?? 'localhost',
        port: parseInt(env.DB_PORT ?? '5432', 10),
        username: env.DB_USERNAME ?? 'postgres',
        password: env.DB_PASSWORD ?? '',
        database: env.DB_NAME ?? 'user_db',
      }),
  entities: ['dist/**/*.entity{.ts,.js}'],
  // Allow toggling synchronize via env; default to true for local development
  synchronize: (env.TYPEORM_SYNC ?? 'true') === 'true', // Set to false in production
};