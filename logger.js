//const pino = require('pino');
import  pino from 'pino'
import             pinoPretty from 'pino-pretty'

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `./app.log` },
});


export const logger = pino({
  base: undefined,
  level: process.env.PINO_LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  /**
  transport: {
    target:'pino-pretty',
      options: {
        colorize:true 
      }
  },*/
},
fileTransport
);
