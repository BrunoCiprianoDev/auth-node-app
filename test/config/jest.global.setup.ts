import util from 'util';
import { config as dotenvConfig } from 'dotenv';
import config from 'config';
import { exec } from 'child_process';
import loggerTests from './logger-tests';

export default async function setup() {
  await preparationEnvironmentVariables();
  await databasePreparation();

  loggerTests.info('Test suite ready. Starting tests...\n');
}

/**
 * Sets up environment variables for testing by loading parameters (database.url and database.schema)
 * from the /config/test.json file and adding them to the .env.test file.
 */
async function preparationEnvironmentVariables() {
  const url = config.get('database.url');
  const schema = config.get('database.schema');
  dotenvConfig({ path: '.env.test' });
  process.env.DATABASE_URL = `${url}?schema=${schema}`;
  process.env.DATABASE_SCHEMA = `${schema}`;
  loggerTests.info(
    'Enviroment variables ready:' +
      `\nDATABASE_URL=${process.env.DATABASE_URL}` +
      `\nDATABASE_SCHEMA=${process.env.DATABASE_SCHEMA}`,
  );
}

/**
 * Using the loaded environment variables, commands are executed to add the migration to the database
 * and insert the seeds.
 */
async function databasePreparation() {
  try {
    const prismaBinary = './node_modules/.bin/prisma';
    const execSync = util.promisify(exec);
    await execSync(`${prismaBinary} migrate deploy`);
    //await execSync(`${prismaBinary} db seed`);
  } catch (error) {
    loggerTests.error(error);
  }
  loggerTests.info('Database for test ready');
}
