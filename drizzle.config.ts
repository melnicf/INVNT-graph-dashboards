import { defineConfig } from 'drizzle-kit';
import { loadDbEnv } from './src/db/load-env';

loadDbEnv();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
