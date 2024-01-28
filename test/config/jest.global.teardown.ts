import pg from 'pg';
import { config as dotenvConfig } from 'dotenv';
import loggerTests from './logger-tests';

/**
 * Using the environment variables DATABASE_URL & DATABASE_SCHEMA, 
 * I delete the schema created for running the tests.
*/
export default async function deleteSchema() {
  loggerTests.info('Deleting schema...');

  dotenvConfig({ path: '.env.test' })

  const url = process.env.DATABASE_URL;
  const schema = process.env.DATABASE_SCHEMA;

  const client = new pg.Client({
    connectionString: url,
  });

  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await client.end();

  loggerTests.info('Schema deleted.\n');
}
