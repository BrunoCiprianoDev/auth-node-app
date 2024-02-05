import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { IDbClient } from '../adapters/dbClient';

export class DbClientPrisma implements IDbClient {
  private static instance: PrismaClient | null = null;

  public getInstance(): PrismaClient {
    if (!DbClientPrisma.instance) {
      DbClientPrisma.instance = new PrismaClient();
    }
    return DbClientPrisma.instance;
  }

  async connect(): Promise<void> {
    try {
      await this.getInstance().$connect();
    } catch (error: unknown) {
      if (error instanceof PrismaClientInitializationError) {
        if (error.errorCode === 'P1012') {
          throw new Error(`Error initializing database: Environment variable not found: DATABASE_URL.
                    \n Please add the DATABASE_URL variable to your .env file.
                    `);
        }
        throw new Error(`${error.message}`);
      }

      throw new Error('Unexpected error during connect database server');
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.getInstance().$disconnect();
    } catch (error) {
      throw new Error('Unexpected error during close connection database server');
    }
  }
}
