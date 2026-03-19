import { config } from 'dotenv';
import { Client } from 'pg';

config();
config({ path: '.env.local', override: true });

async function reset() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query('DROP SCHEMA public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO public');
    console.log('✓ Public schema reset');
  } finally {
    await client.end();
  }
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
