import logger from "./main/util/logger/logger";
import config from 'config'

logger.info(`API_PORT:` + config.get('App.port'));