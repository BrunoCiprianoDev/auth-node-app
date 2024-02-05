import '../../util/moduleAlias/moduleAlias';
import express, { Application } from 'express';
import cors from 'cors';
import * as http from 'http';
import logger from '../../util/logger/logger';
import { IDbClient } from '../../infraestructure/adapters/dbClient';
import routes from './routes';

export class Server {
  private server?: http.Server;
  private app: Application = express();

  public constructor(
    private port = 3000,
    private dbClient: IDbClient,
  ) {}

  public async init(): Promise<void> {
    this.setupCors();
    this.app.use(express.json());
    this.setupRoutes();
    await this.databaseSetup();
  }

  public setupRoutes() {
    this.app.use(routes);
    logger.info('Initialized routes');
  }

  public setupCors(): void {
    this.app.use(
      cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
      }),
    );
    logger.info('Initialized cors');
  }

  private async databaseSetup(): Promise<void> {
    try {
      await this.dbClient.connect();
      logger.info(`Database connection '${this.dbClient.constructor.name}' successfully initialized.`);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`databaseSetup: ${error.message}`);
      } else {
        logger.error(`databaseSetup: ${error}`);
      }
      process.exit();
    }
  }

  private async databaseClose(): Promise<void> {
    await this.dbClient.disconnect();
    logger.info('Database connection closed');
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }

  public async close(): Promise<void> {
    await this.databaseClose();
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close(err => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }

  public getApp(): Application {
    return this.app;
  }
}
