//const pino = require('pino');
import  pino from 'pino'
import             pinoPretty from 'pino-pretty'

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `./app.log` },
});


export const logger = pino({
  base: undefined,
  level: process.env.PINO_LOG_LEVEL || 'trace',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    log (obj) {
      obj.foo='bar';
      delete  obj.log;
      return (obj)
    }
  },
  transport: {
    target:'pino-pretty',
      options: {
        colorize:true 
      }
  },                  
},
fileTransport
);
