const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    printf,
    label,
    timestamp,
    colorize,
    combine
} = format;

const logFormat = printf(({
    level,
    message,
    timestamp
}) => {
    return `${timestamp} ${level}: ${message}`
})

const Logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        colorize(),
        logFormat
    ),
    transports: [new transports.Console()]
});

module.exports = Logger;