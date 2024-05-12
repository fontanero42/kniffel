//const pino = require('pino');
import  pino from 'pino'
import  pinoPretty from 'pino-pretty'

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `./app.log` },
});

/*const prettifyQuery = (value) =>{
  return;
}*/


export const logger = pino({
  base: undefined,
  level: process.env.PINO_LOG_LEVEL || 'trace',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['password','email'],
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
        colorize:true, 
      /*  customPrettifiers:{
          test:prettifyQuery
        }*/
      }
  },                  
},
fileTransport
);
