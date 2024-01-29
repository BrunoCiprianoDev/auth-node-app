import pino from 'pino';
import config from 'config';
import pinoPretty from 'pino-pretty';

export default pino(
  {
    enabled: config.get('logger.enabled'),
    level: config.get('logger.level'),
  },
  pinoPretty(),
);
