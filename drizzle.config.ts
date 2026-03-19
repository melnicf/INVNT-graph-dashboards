import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Drizzle Kit CLI does not load `.env.local` (Next.js does). Match Next.js precedence.
config();
config({ path: '.env.local', override: true });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
