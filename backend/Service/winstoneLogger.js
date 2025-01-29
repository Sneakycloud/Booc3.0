const winston = require('winston');
const  DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';

const logger = winston.createLogger({
    format: combine(
      timestamp({ format: timestampFormat }),
      json(),
      printf(({ timestamp, level, message, ...data }) => {
        const response = {
          level,
          timestamp,
          message,
          data,
        };
  
        return JSON.stringify(response);
      })
    ),
    // store logs in the console
    transports: [
        // log to console
        //new winston.transports.Console(),

        // log to file, but rotate daily
        new DailyRotateFile({
            // each file name includes current date
            filename: 'logs/rotating-logs-%DATE%.log', 
            datePattern: 'MMMM-DD-YYYY',
            zippedArchive: false, // zip logs true/false
            maxSize: '20m', // rotate if file size exceeds 20 MB
            maxFiles: '14d' // max files
      })
    ],
  });

// Usage: logger.warn(/* Message */, /* Metadata object */)
//logger.warn('Hello', { data })

module.exports = logger;