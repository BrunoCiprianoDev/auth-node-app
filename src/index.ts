import logger from './main/util/logger/logger';
import { DbClientPrisma } from './main/infraestructure/prismaORM/dbClientPrisma';
import { Server } from './main/frameworks/express/server';

enum ExitStatus {
  Failure = 1,
  Sucess = 0,
}

(async (): Promise<void> => {
  try {
    const server = new Server(8080, new DbClientPrisma());
    await server.init();
    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    for (const exitSignal of exitSignals) {
      process.on(exitSignal, async () => {
        try {
          await server.close();
          logger.info(`App exited with success`);
          process.exit(ExitStatus.Sucess);
        } catch (error) {
          logger.error(`App exited with error: ${error}`);
          process.exit(ExitStatus.Failure);
        }
      });
    }
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();
