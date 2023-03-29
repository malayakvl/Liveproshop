import pkg from 'winston';
const { createLogger, format, transports } = pkg;
const { combine, timestamp, prettyPrint } = format;

export const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});
