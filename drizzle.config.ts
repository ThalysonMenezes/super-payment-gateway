import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infra/database/postgres-drizzle/schema.ts',
  out: './src/infra/database/postgres-drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
