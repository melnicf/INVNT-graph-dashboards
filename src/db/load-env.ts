import { config } from 'dotenv';

/**
 * Load env for DB CLI scripts and drizzle-kit.
 * - Default: `.env` then `.env.local` (local dev).
 * - `LOAD_ENV_PROD=1`: `.env.prod` only (production DB from your machine/CI).
 */
export function loadDbEnv(): void {
  if (process.env.LOAD_ENV_PROD === '1') {
    config({ path: '.env.prod', override: true });
    return;
  }
  config();
  config({ path: '.env.local', override: true });
}
