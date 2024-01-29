import pino from 'pino';
import pinoPretty from 'pino-pretty';

export default pino(
  {
    enabled: true,
    level: 'info',
  },
  pinoPretty({}),
);
