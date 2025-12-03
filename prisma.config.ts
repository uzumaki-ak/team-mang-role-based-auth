// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // The migration engine reads the production/main URL here
    url: env('POSTGRES_PRISMA_URL'),
    // The shadow DB for migrations (non-pooling)
    shadowDatabaseUrl: env('POSTGRES_URL_NON_POOLING'),
  },
});
